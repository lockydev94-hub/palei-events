"use client"

import { useState, useEffect } from "react"
import { User as UserIcon, LogOut, HelpCircle } from "lucide-react"

interface AvatarMenuProps {
  user: {
    uid: string
    displayName: string | null
    email: string | null
    photoURL: string | null
    role?: "super-admin" | "admin" | "editor" | "viewer"
  }
}

const getInitialColor = (uid: string): string => {
  // Generate a pastel color from uid hash
  let hash = 0
  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = [
    "#f472b6", // pink
    "#a78bfa", // purple
    "#818cf8", // violet
    "#38bdf8", // cyan
    "#14b8a6", // teal
    "#fbbf24", // yellow
    "#f87171", // red
    "#c084fc", // purple-200
  ]
  return colors[Math.abs(hash) % colors.length]
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({ user }) => {
  const [open, setOpen] = useState(false)
  const initial = user.displayName ? user.displayName[0] : "P"
  const color = getInitialColor(user.uid)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".avatar-menu-wrapper")) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="flex items-center rounded-full bg-gold/10 p-2"
        aria-label="Avatar menu"
      >
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.7rem] font-medium ${color}-600`}
        >
          {initial}
        </span>
      </button>

      {open && (
        <div
          ref={(el) => { if (el) el.addEventListener("click", (e) => e.stopPropagation()) }}
          className={`absolute right-0 mt-2 w-56 rounded-lg bg-navy-dark shadow-lg py-2 start-1/2 -translate-x-1/2 z-50 avatar-menu-wrapper`}
        >
          <div className="px-2 pb-1 text-sm text-gold-light">
            {user.displayName || "Admin"}
          </div>

          <ul className="w-full space-y-1 px-2">
            <li>
              <button
                className="w-full flex items-center rounded-md px-3 py-2 text-left hover:bg-gold/10 transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Profile"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Profile
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center rounded-md px-3 py-2 text-left hover:bg-gold/10 transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Switch account"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Switch account
              </button>
            </li>
            {user.role === "super-admin" && (
              <li>
                <button
                  className="w-full flex items-center rounded-md px-3 py-2 text-left hover:bg-red-600/10 transition-colors text-red-400"
                  onClick={() => setOpen(false)}
                  aria-label="Sign out of all sessions"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out of all sessions
                </button>
              </li>
            )}
            <li>
              <button
                className="w-full flex items-center rounded-md px-3 py-2 text-left hover:bg-gold/10 transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Help"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Feedback
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default AvatarMenu