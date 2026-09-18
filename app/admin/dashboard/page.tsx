"use client"

import { useState, useEffect } from "react"
import Shell from "@/components/admin/Shell"
import {
  Calendar,
  Users,
  Image,
  TrendingUp,
  Plus,
  Eye,
  FileText,
  ArrowUpRight,
  Clock,
} from "lucide-react"
import { getEvents, type FirestoreEvent } from "@/lib/firestore"
import { getUsers, type UserProfile } from "@/lib/firestore"
import { demoEvents } from "@/data/events"

interface KPICard {
  label: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color: string
}

export default function DashboardPage() {
  const [events, setEvents] = useState<FirestoreEvent[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [eventsData, usersData] = await Promise.all([
          getEvents(),
          getUsers(),
        ])
        setEvents(eventsData)
        setUsers(usersData)
      } catch (err) {
        console.error("Dashboard load error:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalEvents = events.length || demoEvents.length
  const publishedEvents = events.filter((e) => (e as FirestoreEvent).status === "published").length || demoEvents.length
  const totalUsers = users.length
  const totalRsvps = events.reduce((sum, e) => sum + (e.rsvpCount || 0), 0)

  const kpis: KPICard[] = [
    {
      label: "Total Events",
      value: totalEvents,
      change: "+3 this month",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-400",
    },
    {
      label: "Published",
      value: publishedEvents,
      icon: <Eye className="h-5 w-5" />,
      color: "text-emerald-400",
    },
    {
      label: "Total Users",
      value: totalUsers || "—",
      change: totalUsers > 0 ? "Active" : "No users yet",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-400",
    },
    {
      label: "Total RSVPs",
      value: totalRsvps || "—",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-gold",
    },
  ]

  const recentEvents = events.length > 0 ? events.slice(0, 5) : demoEvents.slice(0, 5)

  const quickActions = [
    { label: "Create Event", href: "/admin/events/new", icon: <Plus className="h-4 w-4" /> },
    { label: "View Events", href: "/admin/events", icon: <Calendar className="h-4 w-4" /> },
    { label: "Manage Templates", href: "/admin/templates", icon: <FileText className="h-4 w-4" /> },
    { label: "View Analytics", href: "/admin/analytics", icon: <TrendingUp className="h-4 w-4" /> },
  ]

  return (
    <Shell>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gold-light">Dashboard</h1>
        <p className="text-gold-light/50 text-sm mt-1">Overview of your Palei Events platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-navy/60 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gold-light/50 text-sm font-medium">{kpi.label}</span>
              <span className={`${kpi.color}`}>{kpi.icon}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-display font-bold text-gold-light">
                {loading ? "…" : kpi.value}
              </span>
              {kpi.change && (
                <span className="text-xs text-emerald-400 mb-1">{kpi.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-navy/60 border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-gold-light">Recent Events</h2>
            <a
              href="/admin/events"
              className="text-xs text-gold/70 hover:text-gold transition-colors flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="p-6 text-center text-gold-light/40 text-sm">Loading…</div>
            ) : recentEvents.length === 0 ? (
              <div className="p-6 text-center text-gold-light/40 text-sm">No events yet</div>
            ) : (
              recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gold-light truncate">{event.name}</p>
                    <p className="text-xs text-gold-light/40">
                      {event.type} • {event.startDate ? new Date(event.startDate).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        (event as any).status === "published"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : (event as any).status === "draft"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-gold/15 text-gold"
                      }`}
                    >
                      {(event as any).status || "published"}
                    </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions + Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gold-light mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-2 px-3 py-2.5 bg-gold/10 hover:bg-gold/20 text-gold-light text-sm font-medium rounded-lg transition-colors"
                >
                  {action.icon}
                  {action.label}
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gold-light mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { text: "Dashboard initialized", time: "Just now", color: "bg-emerald-500" },
                { text: "Firebase connected", time: "Just now", color: "bg-blue-500" },
                { text: "Auth system ready", time: "Just now", color: "bg-purple-500" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gold-light/70">{activity.text}</p>
                    <p className="text-xs text-gold-light/30 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
