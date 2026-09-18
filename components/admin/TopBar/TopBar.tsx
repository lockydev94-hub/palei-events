"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Bell, X, LogOut, Menu } from "lucide-react"
import ThemeToggle from "@/components/ui/ThemeToggle"
import { useAuth } from "@/components/admin/auth/AuthContext"

type TopBarProps = {
  open: boolean
  setOpen: (open: boolean) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  onSearch: (query: string) => void
  notifications: any[]
  onNotificationClick: (id: string) => void
  user: any
  toggleSidebar: () => void
  onLogout?: () => void
}

const TopBar: React.FC<TopBarProps> = ({
  open,
  setOpen,
  searchOpen,
  setSearchOpen,
  onSearch,
  notifications,
  user,
  toggleSidebar,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)

  // Close search on outside click
  useEffect(() => {
    if (!searchOpen) return
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [searchOpen, setSearchOpen])

  const navLinks = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Events", href: "/admin/events" },
    { label: "Templates", href: "/admin/templates" },
    { label: "Content", href: "/admin/content" },
    { label: "Users", href: "/admin/users" },
  ]

  return (
    <header className="border-b border-white/8 bg-navy/90 backdrop-blur-xl sticky top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3">
        {/* Left: Logo + mobile menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gold/10 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gold-light" />
          </button>
          <a href="/admin/dashboard" className="text-gold-light font-display text-lg font-semibold tracking-tight">
            Palei <span className="text-gold">Events</span>
          </a>
        </div>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-gold-light/70 hover:text-gold-light hover:bg-gold/10 rounded-md transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-md hover:bg-gold/10 transition-colors"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5 text-gold-light" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-navy-dark border border-white/10 rounded-xl shadow-xl p-3 z-50">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gold-light/50" />
                  <input
                    type="text"
                    placeholder="Search events, templates, users…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSearch(searchQuery)
                        setSearchQuery("")
                      }
                      if (e.key === "Escape") {
                        setSearchOpen(false)
                        setSearchQuery("")
                      }
                    }}
                    className="flex-1 bg-transparent text-sm text-gold-light outline-none placeholder-gold-light/40"
                    autoFocus
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery("") }}>
                    <X className="h-4 w-4 text-gold-light/50 hover:text-gold-light" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-md hover:bg-gold/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5 text-gold-light" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {notifications.length > 99 ? "99+" : notifications.length}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gold/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold-light text-sm font-bold">
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "A"}
              </div>
            </button>
            <div className="absolute right-0 top-full mt-1 w-56 bg-navy-dark border border-white/10 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-sm font-medium text-gold-light truncate">{user?.displayName || "Admin"}</p>
                <p className="text-xs text-gold-light/50 truncate">{user?.email}</p>
              </div>
              <a
                href="/admin/dashboard"
                className="block px-4 py-2 text-sm text-gold-light/70 hover:bg-gold/10 hover:text-gold-light transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/"
                className="block px-4 py-2 text-sm text-gold-light/70 hover:bg-gold/10 hover:text-gold-light transition-colors"
              >
                View Site
              </a>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
