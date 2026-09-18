"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "./AuthContext"
import { Loader2 } from "lucide-react"

/**
 * Client-side route guard for any /admin/* page.
 *
 * Why a client component: Firebase Auth is browser-only and the user
 * profile (with the admin custom claim) only resolves after
 * `onAuthStateChanged` fires. Server-side middleware can't reach that
 * state, so this is the right place for the redirect.
 *
 * Behavior:
 *   1. While the auth state is still loading → show a spinner (don't flash a login form).
 *   2. Unauthenticated user → redirect to /admin/login (preserving the intended URL).
 *   3. Authenticated but `isAdmin === false` → redirect to /admin/login with `?denied=1`.
 *   4. Admin user → render children.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    // Don't try to guard the login page itself — otherwise we get a redirect loop.
    if (pathname === "/admin/login") return

    if (!user) {
      const next = encodeURIComponent(pathname || "/admin")
      router.replace(`/admin/login?next=${next}`)
      return
    }

    if (!user.isAdmin) {
      router.replace("/admin/login?denied=1")
    }
  }, [loading, user, pathname, router])

  if (loading || !user || !user.isAdmin) {
    // The login page must render even when the visitor isn't authenticated —
    // otherwise the redirect target is hidden behind our spinner.
    if (pathname === "/admin/login") {
      return <>{children}</>
    }
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gold-light/60">
          <Loader2 className="h-7 w-7 animate-spin text-gold" />
          <p className="text-xs uppercase tracking-widest">
            {loading ? "Checking session…" : "Redirecting…"}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
