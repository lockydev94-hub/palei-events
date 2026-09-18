"use client"

/**
 * Route guard for the customer portal.
 *
 *  1. Loading  → gold spinner (no redirect flash)
 *  2. Logged out → /login?next=…
 *  3. Admin    → bounced to the admin console (admins don't use this portal)
 *  4. Approved plan → children (full dashboard)
 *  5. Free plan → children ONLY on the status surfaces (/dashboard,
 *     /dashboard/plan, /dashboard/profile) where they see their requested
 *     plan details; feature pages (events, rsvps, wishes) redirect there —
 *     features unlock the moment the admin activates the plan.
 */
import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCustomerAuth } from "./CustomerAuthContext"

/** Pages a free customer can open while waiting for plan activation. */
export const PLAN_GATED_ROUTES = ["/dashboard", "/dashboard/plan", "/dashboard/profile"]

export function RequireCustomer({ children }: { children: ReactNode }) {
  const { user, loading } = useCustomerAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user) {
      const next = encodeURIComponent(pathname || "/dashboard")
      router.replace(`/login?next=${next}`)
    }
  }, [loading, user, pathname, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#faf8f3" }}>
        <div className="flex flex-col items-center gap-4">
          <span
            className="h-10 w-10 animate-spin rounded-full"
            style={{
              border: "3px solid rgba(200,155,60,0.2)",
              borderTopColor: "#c89b3c",
            }}
            aria-hidden
          />
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-mutedText">
            {loading ? "Checking your session…" : "Redirecting…"}
          </p>
        </div>
      </div>
    )
  }

  // Admins belong in /admin — never inside the customer portal.
  if (user.isAdmin) {
    if (typeof window !== "undefined") router.replace("/admin/dashboard")
    return null
  }

  // Plan gate: free customers may open the status surfaces only.
  if (user.plan === "free") {
    const allowed =
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/plan") ||
      pathname.startsWith("/dashboard/profile")
    if (!allowed) {
      // Feature page while unapproved → show the status surface instead.
      return <LockedRedirect target="/dashboard" />
    }
  }

  return <>{children}</>
}

/** Soft redirect that renders nothing until navigation completes. */
function LockedRedirect({ target }: { target: string }) {
  const router = useRouter()
  useEffect(() => {
    router.replace(target)
  }, [router, target])
  return null
}
