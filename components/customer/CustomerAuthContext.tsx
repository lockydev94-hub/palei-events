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
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
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

/**
 * De-dupes concurrent profile loads for the same uid. Without this, the
 * onAuthStateChanged listener and an explicit login()/register() call can
 * race: whoever writes the profile doc second performs an *update* with
 * keys the security rules' update-allowlist rejects → the customer sees
 * "Missing or insufficient permissions." One uid = one in-flight promise.
 */
const profileInFlight = new Map<string, Promise<{ isAdmin: boolean; plan: string }>>()

async function fetchOrCreateProfile(
  firebaseUser: User
): Promise<{ isAdmin: boolean; plan: string }> {
  // Admins carry the custom claim; they never touch the customer portal.
  const token = await firebaseUser.getIdTokenResult()
  const isAdmin = token.claims.admin === true

  const userRef = doc(db, "users", firebaseUser.uid)

  // Existing profile → read plan, touch lastLogin (allowed fields only).
  try {
    const snap = await getDoc(userRef)
    if (snap.exists()) {
      const plan = (snap.data() as { plan?: string }).plan || "free"
      updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch(() => {}) // cosmetic only — never block sign-in on it
      return { isAdmin, plan }
    }
  } catch {
    // Read failed (e.g. claim not yet on token) — fall through to create.
  }

  if (isAdmin) return { isAdmin, plan: "free" }

  // First login (register or Google) — create the customer profile.
  // The rules force role == "customer" for self-created profiles. A merge
  // write tolerates a concurrent creator; if we lose that race the doc
  // simply exists afterwards and we read the winner's values.
  try {
    await setDoc(
      userRef,
      {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? "",
        displayName: firebaseUser.displayName ?? "",
        photoURL: firebaseUser.photoURL ?? "",
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
  } catch {
    // Lost the create race (or claim lag) — the re-read below resolves it.
  }

  let plan = "free"
  try {
    const snap = await getDoc(userRef)
    if (snap.exists()) {
      plan = (snap.data() as { plan?: string }).plan || "free"
    }
  } catch {
    // Keep "free" — RequireCustomer's gate handles the fallback safely.
  }
  return { isAdmin, plan }
}

function loadOrCreateProfile(
  firebaseUser: User
): Promise<{ isAdmin: boolean; plan: string }> {
  const uid = firebaseUser.uid
  let inFlight = profileInFlight.get(uid)
  if (!inFlight) {
    inFlight = fetchOrCreateProfile(firebaseUser).finally(() => {
      profileInFlight.delete(uid)
    })
    profileInFlight.set(uid, inFlight)
  }
  return inFlight
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
      // Do NOT setDoc the profile here. The onAuthStateChanged listener
      // (which fires as soon as the auth user exists) owns profile
      // creation via loadOrCreateProfile — a second concurrent write from
      // this path would land as an *update* with fields the rules reject
      // ("Missing or insufficient permissions"). Awaiting the shared
      // de-duped promise is race-safe and gives us the authoritative plan.
      const { plan } = await loadOrCreateProfile(result.user)
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        photoURL: result.user.photoURL,
        isAdmin: false,
        plan,
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
