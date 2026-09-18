import type { Metadata } from "next"
import { CustomerAuthProvider } from "@/components/customer/CustomerAuthContext"
import { RequireCustomer } from "@/components/customer/RequireCustomer"
import { DashboardShell } from "@/components/customer/DashboardShell"

export const metadata: Metadata = {
  title: "Dashboard — Palei Events",
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerAuthProvider>
      <RequireCustomer>
        <DashboardShell>{children}</DashboardShell>
      </RequireCustomer>
    </CustomerAuthProvider>
  )
}
