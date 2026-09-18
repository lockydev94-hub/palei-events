"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import {
  CalendarDays,
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react"
import { useCustomerAuth } from "./CustomerAuthContext"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "My Events", icon: CalendarDays },
  { href: "/dashboard/rsvps", label: "RSVPs", icon: Mail },
  { href: "/dashboard/wishes", label: "Wishes", icon: Heart },
  { href: "/dashboard/plan", label: "Plan & Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
]

function initials(nameOrEmail: string | null): string {
  if (!nameOrEmail) return "?"
  const parts = nameOrEmail.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean)
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "")).toUpperCase() || "?"
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout } = useCustomerAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await logout()
    router.replace("/login")
  }

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-[0.87rem] font-medium transition-all duration-200"
            style={
              active
                ? {
                    background: "linear-gradient(135deg, rgba(200,155,60,0.18), rgba(200,155,60,0.06))",
                    border: "1px solid rgba(200,155,60,0.35)",
                    color: "#e0c584",
                  }
                : {
                    border: "1px solid transparent",
                    color: "rgba(255,253,248,0.55)",
                  }
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )

  const sidebarInner = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-6 pt-7 pb-6"
        onClick={() => setMobileOpen(false)}
      >
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(145deg, rgba(200,155,60,0.22), rgba(200,155,60,0.07))",
            border: "1px solid rgba(200,155,60,0.35)",
          }}
        >
          <Sparkles className="h-5 w-5" style={{ color: "#e0c584" }} />
        </span>
        <span>
          <span
            className="block font-display font-bold text-[1.05rem] leading-none"
            style={{
              background: "linear-gradient(110deg, #f5dfa0, #e0c584, #c89b3c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Palei Events
          </span>
          <span
            className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "rgba(255,253,248,0.35)" }}
          >
            Customer Portal
          </span>
        </span>
      </Link>

      {nav}

      {/* User block */}
      <div className="mt-auto px-4 pb-6">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,253,248,0.04)",
            border: "1px solid rgba(255,253,248,0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[0.7rem] font-bold"
              style={{ background: "linear-gradient(135deg, #c89b3c, #a67f2e)", color: "#0f1522" }}
            >
              {initials(user?.displayName || user?.email || null)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.8rem] font-semibold" style={{ color: "rgba(255,253,248,0.85)" }}>
                {user?.displayName || user?.email?.split("@")[0] || "Customer"}
              </p>
              <p className="truncate text-[0.68rem]" style={{ color: "rgba(255,253,248,0.4)" }}>
                {user?.plan === "free" ? "No active plan" : `${user?.plan} plan`}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[0.78rem] font-semibold transition-colors duration-200"
            style={{
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "#faf8f3" }}>
      {/* ── Desktop sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block"
        style={{
          background: "linear-gradient(180deg, #0f1522 0%, #172033 100%)",
          borderRight: "1px solid rgba(200,155,60,0.12)",
        }}
      >
        {sidebarInner}
      </aside>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw]"
            style={{ background: "linear-gradient(180deg, #0f1522 0%, #172033 100%)" }}
          >
            <button
              className="absolute top-5 right-4 p-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{ color: "rgba(255,253,248,0.6)" }}
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarInner}
          </aside>
        </div>
      )}

      {/* ── Mobile top bar ── */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 lg:hidden"
        style={{
          background: "rgba(15,21,34,0.96)",
          borderBottom: "1px solid rgba(200,155,60,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2"
          style={{ color: "#e0c584", border: "1px solid rgba(200,155,60,0.3)" }}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span
          className="font-display font-bold text-[1rem]"
          style={{
            background: "linear-gradient(110deg, #f5dfa0, #c89b3c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Palei Events
        </span>
        <button
          onClick={handleLogout}
          className="ml-auto rounded-lg p-2"
          style={{ color: "#fca5a5" }}
          aria-label="Sign out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* ── Main content ── */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  )
}

/* Shared page header for dashboard pages */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[1.75rem] font-semibold leading-tight text-navy">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-[0.9rem] text-mutedText">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/* Shared card */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "rgba(255,253,248,0.96)",
        border: "1px solid rgba(23,32,51,0.09)",
        boxShadow: "0 4px 24px rgba(23,32,51,0.05)",
      }}
    >
      {children}
    </div>
  )
}
