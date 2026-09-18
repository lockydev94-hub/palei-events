"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { auth, db } from "@/lib/firebase"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAdmin: boolean
  role: "super-admin" | "admin" | "editor" | "viewer"
  plan: "free" | "celebration" | "premium" | "business" | "enterprise"
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // eslint-disable-next-line no-console
        console.log(
          "[auth] onAuthStateChanged uid:",
          firebaseUser.uid,
          "email:",
          firebaseUser.email
        )
        // Hoisted so the catch block can read the token claim after a
        // Firestore read failure. The admin claim is on the ID token
        // itself — it's authoritative for `isAdmin` regardless of
        // whether the profile doc is readable.
        let isAdminClaim = false
        try {
          // Get the ID token to check custom claims. Force a refresh so a
          // session persisted before `setCustomUserClaims` ran still picks
          // up the latest admin claim — otherwise Firestore rejects reads
          // with `permission-denied` because `request.auth.token.admin`
          // is still `false`.
          let tokenResult = await firebaseUser.getIdTokenResult(true)
          isAdminClaim = tokenResult.claims.admin === true
          // eslint-disable-next-line no-console
          console.log("[auth] token claims:", JSON.stringify(tokenResult.claims), "isAdmin:", isAdminClaim)

          // Fetch user profile from Firestore. If the read fails with
          // permission-denied we may be holding a token issued before
          // custom claims were set (e.g. session persisted across a
          // claim rotation). Refresh once and retry.
          const userRef = doc(db, "users", firebaseUser.uid)
          // eslint-disable-next-line no-console
          console.log("[auth] reading profile from:", userRef.path)

          let userSnap: Awaited<ReturnType<typeof getDoc>>
          try {
            userSnap = await getDoc(userRef)
          } catch (readErr: any) {
            // eslint-disable-next-line no-console
            console.error(
              "[auth] profile getDoc failed:",
              readErr?.code,
              readErr?.message,
              "ref:",
              userRef.path
            )
            if (readErr?.code === "permission-denied") {
              // eslint-disable-next-line no-console
              console.warn(
                "[auth] profile read denied, refreshing token + retrying. claim before:",
                isAdminClaim
              )
              tokenResult = await firebaseUser.getIdTokenResult(true)
              isAdminClaim = tokenResult.claims.admin === true
              // eslint-disable-next-line no-console
              console.warn(
                "[auth] claim after refresh:",
                isAdminClaim,
                "claims:",
                JSON.stringify(tokenResult.claims)
              )
              try {
                userSnap = await getDoc(userRef)
              } catch (retryErr: any) {
                // eslint-disable-next-line no-console
                console.error(
                  "[auth] profile getDoc still denied after refresh:",
                  retryErr?.code,
                  retryErr?.message
                )
                throw retryErr
              }
            } else {
              throw readErr
            }
          }

          let role: AuthUser["role"] = "viewer"
          let plan: AuthUser["plan"] = "free"

          if (userSnap.exists()) {
            const profile = userSnap.data() as Record<string, any>
            role = profile.role || (isAdminClaim ? "admin" : "viewer")
            plan = profile.plan || "free"
          } else if (isAdminClaim) {
            // Create user profile if it doesn't exist for admin
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: "admin",
              plan: "free",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              eventsCreated: 0,
              preferences: {
                theme: "dark",
                reduceMotion: false,
                onboardingCompleted: false,
              },
            }
            await setDoc(userRef, newProfile)
            role = "admin"
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAdmin: isAdminClaim,
            role,
            plan,
          })
        } catch (err) {
          // Don't gate access on the profile doc being readable. The
          // admin claim is on the ID token itself (verified by the
          // Firestore rules engine), not on the profile doc — so the
          // user IS an admin even if the read fails. Fall back to the
          // token claim and the bare auth info; log loudly so we can
          // investigate the underlying read failure separately.
          console.error("[auth] Error loading user profile:", err)
          console.warn(
            "[auth] falling back to ID-token claim; profile read failed but isAdminClaim =",
            isAdminClaim
          )
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAdmin: isAdminClaim,
            role: isAdminClaim ? "admin" : "viewer",
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

  const login = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    // Force token refresh to get latest custom claims
    await result.user.getIdToken(true)
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    await result.user.getIdToken(true)
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
