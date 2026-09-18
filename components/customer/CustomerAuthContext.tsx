"use client"

/**
 * Customer-portal auth context.
 *
 * Deliberately separate from the admin AuthContext: customers
 * self-register, always get the fixed "customer" role (the Firestore
 * rules refuse any other value on self-created profiles), and are
 * gated behind an approved plan before they can use the dashboard.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export interface CustomerUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAdmin: boolean
  plan: string
}

interface CustomerAuthContextType {
  user: CustomerUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<CustomerUser>
  register: (name: string, email: string, password: string) => Promise<CustomerUser>
  loginWithGoogle: () => Promise<CustomerUser>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
  refreshPlan: () => Promise<string>
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(
  undefined
)

export function useCustomerAuth(): CustomerAuthContextType {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) {
    throw new Error(
      "useCustomerAuth must be used within a CustomerAuthProvider"
    )
  }
  return ctx
}

async function loadOrCreateProfile(
  firebaseUser: User
): Promise<{ isAdmin: boolean; plan: string }> {
  // Admins carry the custom claim; they never touch the customer portal.
  const token = await firebaseUser.getIdTokenResult()
  const isAdmin = token.claims.admin === true

  const userRef = doc(db, "users", firebaseUser.uid)
  let plan = "free"
  let snap
  try {
    snap = await getDoc(userRef)
  } catch {
    snap = null
  }

  if (snap?.exists()) {
    plan = (snap.data() as { plan?: string }).plan || "free"
  } else if (!isAdmin) {
    // First login (e.g. via Google) — create the customer profile.
    // The rules force role == "customer" for self-created profiles.
    await setDoc(
      userRef,
      {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        role: "customer",
        plan: "free",
        eventsCreated: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        preferences: { theme: "light", onboardingCompleted: false },
      },
      { merge: true }
    )
  }
  return { isAdmin, plan }
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { isAdmin, plan } = await loadOrCreateProfile(firebaseUser)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAdmin,
            plan,
          })
        } catch (err) {
          console.error("[customer-auth] profile load failed:", err)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAdmin: false,
            plan: "free",
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<CustomerUser> => {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const { isAdmin, plan } = await loadOrCreateProfile(result.user)
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        isAdmin,
        plan,
      }
    },
    []
  )

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<CustomerUser> => {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (name) {
        await updateProfile(result.user, { displayName: name })
      }
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        photoURL: "",
        role: "customer",
        plan: "free",
        eventsCreated: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        preferences: { theme: "light", onboardingCompleted: false },
      })
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        photoURL: result.user.photoURL,
        isAdmin: false,
        plan: "free",
      }
    },
    []
  )

  const loginWithGoogle = useCallback(async (): Promise<CustomerUser> => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const { isAdmin, plan } = await loadOrCreateProfile(result.user)
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      isAdmin,
      plan,
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
  }, [])

  const refreshPlan = useCallback(async (): Promise<string> => {
    if (!auth.currentUser) return "free"
    const { plan } = await loadOrCreateProfile(auth.currentUser)
    setUser((prev) => (prev ? { ...prev, plan } : prev))
    return plan
  }, [])

  return (
    <CustomerAuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, resetPassword, logout, refreshPlan }}
    >
      {children}
    </CustomerAuthContext.Provider>
  )
}
