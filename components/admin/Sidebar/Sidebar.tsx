"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Calendar,
  LayoutGrid,
  FileText,
  Users,
  BarChart3,
  Megaphone,
  Settings,
  CreditCard,
  X,
  type LucideIcon,
} from "lucide-react"

interface NavItem {
  key: string
  label: string
  icon: LucideIcon
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { key: "events", label: "Events", icon: Calendar, href: "/admin/events" },
  { key: "templates", label: "Templates", icon: LayoutGrid, href: "/admin/templates" },
  { key: "content", label: "Content", icon: FileText, href: "/admin/content" },
  { key: "users", label: "Users", icon: Users, href: "/admin/users" },
  { key: "billing", label: "Billing", icon: CreditCard, href: "/admin/billing" },
  { key: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { key: "marketing", label: "Marketing", icon: Megaphone, href: "/admin/marketing" },
  { key: "operations", label: "Settings", icon: Settings, href: "/admin/operations" },
]

const Sidebar: React.FC<{
  open: boolean
  pathname: string
  toggleSidebar: () => void
}> = ({ open, pathname, toggleSidebar }) => {
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(false)
      } else {
        setExpanded(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard"
    return pathname.startsWith(href)
  }

  const showSidebar = expanded || open

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 lg:top-[53px] left-0 z-40
          h-[calc(100vh-53px)] bg-navy border-r border-white/5
          transition-all duration-200 ease-out
          ${showSidebar ? "w-60" : "w-0 lg:w-16"}
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-hidden flex-shrink-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close */}
          <div className="flex items-center justify-end p-3 lg:hidden">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-gold/10 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-gold-light" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150
                    ${active
                      ? "bg-gold/15 text-gold border-l-2 border-gold"
                      : "text-gold-light/60 hover:bg-gold/8 hover:text-gold-light border-l-2 border-transparent"
                    }
                    ${!showSidebar ? "justify-center px-2" : ""}
                  `}
                  title={!showSidebar ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-gold" : ""}`} />
                  {showSidebar && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          {showSidebar && (
            <div className="p-4 border-t border-white/5">
              <a
                href="/"
                target="_blank"
                className="flex items-center gap-2 text-xs text-gold-light/40 hover:text-gold-light/70 transition-colors"
              >
                <span>View Live Site</span>
                <span>↗</span>
              </a>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
