"use client"

import { useState, useEffect } from "react"
import Shell from "@/components/admin/Shell"
import { getUsers, type UserProfile } from "@/lib/firestore"
import { Search, Users as UsersIcon, Mail, Shield, Calendar } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (err) {
        console.error("Failed to load users:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const roleColors: Record<string, string> = {
    "super-admin": "bg-red-500/15 text-red-400",
    admin: "bg-gold/15 text-gold",
    editor: "bg-blue-500/15 text-blue-400",
    viewer: "bg-gold-light/10 text-gold-light/60",
  }

  return (
    <Shell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gold-light">Users</h1>
          <p className="text-gold-light/50 text-sm mt-1">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-light/40" />
        <input
          type="text"
          placeholder="Search users by name or email…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-navy/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors placeholder:text-gold-light/30"
        />
      </div>

      {/* Users Table */}
      <div className="bg-navy/60 border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gold-light/40 text-sm">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <UsersIcon className="h-12 w-12 text-gold-light/20 mx-auto mb-3" />
            <p className="text-gold-light/50 text-sm">
              {users.length === 0
                ? "No users yet. Users will appear here after they sign up."
                : "No users match your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider hidden md:table-cell">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider hidden lg:table-cell">
                    Plan
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider hidden lg:table-cell">
                    Events
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider hidden xl:table-cell">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((user) => (
                  <tr key={user.uid} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center text-gold-light text-sm font-bold flex-shrink-0">
                          {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gold-light truncate">
                            {user.displayName || "Unknown"}
                          </p>
                          <p className="text-xs text-gold-light/40 flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          roleColors[user.role] || "bg-gold/10 text-gold"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs text-gold-light/60 capitalize">{user.plan}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs text-gold-light/60">{user.eventsCreated || 0}</span>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <span className="text-xs text-gold-light/40 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Shell>
  )
}
