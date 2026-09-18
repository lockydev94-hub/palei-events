"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/admin/auth/AuthContext"
import { Menu } from "lucide-react"

import TopBar from "@/components/admin/TopBar"
import Sidebar from "@/components/admin/Sidebar"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb"
import { LoadingState } from "@/components/ui/LoadingState"

const Shell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifications] = useState<any[]>([])

  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login")
    }
  }, [loading, user, router])

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const handleSearch = useCallback((query: string) => {
    if (query.includes("event")) router.push("/admin/events")
    else if (query.includes("template")) router.push("/admin/templates")
    else if (query.includes("user")) router.push("/admin/users")
    else router.push("/admin/dashboard")
    setSearchOpen(false)
  }, [router])

  const handleNotificationClick = useCallback((_id: string) => {
    // Future: navigate to related item
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
    router.replace("/admin/login")
  }, [logout, router])

  // Build breadcrumbs from pathname
  const breadcrumbItems: BreadcrumbItem[] = [{ label: "Home", href: "/admin/dashboard" }]
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length > 1) {
    const pathMap: Record<string, string> = {
      dashboard: "Dashboard",
      events: "Events",
      templates: "Templates",
      content: "Content",
      blog: "Blog",
      features: "Features",
      pricing: "Pricing",
      users: "Users",
      analytics: "Analytics",
      billing: "Billing",
      marketing: "Marketing",
      operations: "Operations",
      settings: "Settings",
      login: "Login",
      "new": "New",
      edit: "Edit",
    }
    let accumPath = ""
    for (const seg of segments) {
      accumPath += `/${seg}`
      if (seg === "admin") continue
      breadcrumbItems.push({
        label: pathMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
        href: accumPath,
      })
    }
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <LoadingState label="Loading admin…" />
      </div>
    )
  }

  // Don't render anything if not logged in (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-navy-dark flex flex-col">
      <TopBar
        open={open}
        setOpen={setOpen}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onSearch={handleSearch}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        user={user}
        toggleSidebar={() => setOpen((p) => !p)}
        onLogout={handleLogout}
      />
      <div className="flex flex-1">
        <Sidebar open={open} pathname={pathname} toggleSidebar={() => setOpen((p) => !p)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-0 min-w-0">
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} light />
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Shell
