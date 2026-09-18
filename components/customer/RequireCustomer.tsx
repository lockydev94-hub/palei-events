"use client"

/**
 * Route guard for the customer portal.
 *
 *  1. Loading  → gold spinner (no redirect flash)
 *  2. Logged out → /login?next=…
 *  3. Admin    → bounced to the admin console (admins don't use this portal)
 *  4. Approved plan → children
 *  5. Free / pending plan → PlanGate (request UI) instead of the dashboard
 */
import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCustomerAuth } from "./CustomerAuthContext"
import { PlanGate } from "./PlanGate"

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

  // The plan gate: free customers only see the plan request surface.
  if (user.plan === "free") {
    return <PlanGate />
  }

  return <>{children}</>
}
