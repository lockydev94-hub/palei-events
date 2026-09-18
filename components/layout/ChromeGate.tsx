"use client"

/**
 * Hides public-site chrome (Navbar, Footer, FloatingContact, ScrollToTop,
 * announcement bar) on the customer dashboard, which has its own full
 * application shell. Admin pages are hidden by the components themselves.
 */
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin")
  ) {
    return null
  }
  return <>{children}</>
}
