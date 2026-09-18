import type { Metadata } from "next"
import { AuthProvider } from "@/components/admin/auth/AuthContext"
import { RequireAdmin } from "@/components/admin/auth/RequireAdmin"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* RequireAdmin lets /admin/login through; everything else is gated. */}
      <RequireAdmin>{children}</RequireAdmin>
    </AuthProvider>
  )
}
