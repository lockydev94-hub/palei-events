"use client"

/**
 * Lightweight public-session reader for the site header.
 *
 * Reads the DEFAULT Firebase auth session (the customer portal's) without
 * mounting the full CustomerAuthProvider on every page. The admin console
 * uses its own app, so an admin sign-in never shows here and vice versa.
 *
 * Read-only on purpose: profile creation stays in CustomerAuthContext so
 * the register race-fix keeps a single writer.
 */
import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export interface PublicCustomer {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  plan: string
}

export function usePublicCustomer(): {
  user: PublicCustomer | null
  loading: boolean
  signOutPublic: () => Promise<void>
} {
  const [user, setUser] = useState<PublicCustomer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }
      let plan = "free"
      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid))
        if (snap.exists()) {
          plan = (snap.data() as { plan?: string }).plan || "free"
        }
      } catch {
        // Profile read is cosmetic for the menu — never block rendering.
      }
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        plan,
      })
      setLoading(false)
    })
    return () => unsub()
  }, [])

  async function signOutPublic() {
    await signOut(auth)
    setUser(null)
  }

  return { user, loading, signOutPublic }
}
