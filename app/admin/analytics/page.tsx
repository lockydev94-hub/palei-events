"use client"

import { useState, useEffect, useMemo } from "react"
import Shell from "@/components/admin/Shell"
import {
  getEvents,
  getBlogPosts,
  getTemplates,
  getUsers,
  type FirestoreEvent,
  type BlogPost,
  type Template,
  type UserProfile,
} from "@/lib/firestore"
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Calendar,
  Loader2,
  FileText,
  LayoutGrid,
  Activity,
} from "lucide-react"

type Range = "7d" | "30d" | "90d" | "all"

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30d")
  const [events, setEvents] = useState<FirestoreEvent[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [e, b, t, u] = await Promise.all([
          getEvents(),
          getBlogPosts(),
          getTemplates(),
          getUsers(),
        ])
        setEvents(e)
        setPosts(b)
        setTemplates(t)
        setUsers(u)
      } catch (err) {
        console.error("Analytics load error:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Time-bounded counts.
  const cutoff = useMemo(() => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365 * 100
    return Date.now() - days * 24 * 60 * 60 * 1000
  }, [range])

  const eventsInRange = useMemo(
    () => events.filter((e) => new Date(e.createdAt ?? e.startDate ?? 0).getTime() >= cutoff),
    [events, cutoff]
  )
  const postsInRange = useMemo(
    () => posts.filter((p) => new Date(p.date ?? 0).getTime() >= cutoff),
    [posts, cutoff]
  )

  const totals = {
    eventsTotal: events.length,
    eventsInRange: eventsInRange.length,
    eventsPublished: events.filter((e) => e.status === "published").length,
    eventsDraft: events.filter((e) => e.status === "draft").length,
    eventsArchived: events.filter((e) => e.status === "archived").length,
    postsTotal: posts.length,
    postsInRange: postsInRange.length,
    templatesTotal: templates.length,
    templatesFeatured: templates.filter((t) => t.featured).length,
    usersTotal: users.length,
    usersWithPlan: users.filter((u) => u.plan && u.plan !== "free").length,
  }

  // Aggregate RSVP / wish counts.
  const rsvpTotal = events.reduce((acc, e) => acc + Number(e.metadata?.rsvpCount ?? 0), 0)
  const wishTotal = events.reduce((acc, e) => acc + Number(e.metadata?.wishCount ?? 0), 0)

  // Top events by RSVP count.
  const topEvents = useMemo(
    () =>
      [...events]
        .filter((e) => Number(e.metadata?.rsvpCount ?? 0) > 0)
        .sort((a, b) => Number(b.metadata?.rsvpCount ?? 0) - Number(a.metadata?.rsvpCount ?? 0))
        .slice(0, 5),
    [events]
  )

  const maxRsvp = Math.max(1, ...topEvents.map((e) => Number(e.metadata?.rsvpCount ?? 0)))

  return (
    <Shell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gold-light">Analytics</h1>
          <p className="text-gold-light/50 text-sm mt-1">Platform metrics and insights</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as Range)}
          className="bg-navy/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-gold-light outline-none focus:border-gold/50 appearance-none cursor-pointer"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : (
        <>
          {/* Top KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPI
              icon={Calendar}
              label="Events in range"
              value={totals.eventsInRange}
              sub={`${totals.eventsTotal} total · ${totals.eventsPublished} live`}
            />
            <KPI
              icon={Users}
              label="Users"
              value={totals.usersTotal}
              sub={`${totals.usersWithPlan} on a paid plan`}
            />
            <KPI
              icon={Activity}
              label="RSVPs"
              value={rsvpTotal}
              sub="Across all events"
            />
            <KPI
              icon={Heart}
              label="Wishes"
              value={wishTotal}
              sub="Across all events"
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KPI
              icon={Calendar}
              label="Event status"
              value=""
              sub={`${totals.eventsPublished} published · ${totals.eventsDraft} drafts · ${totals.eventsArchived} archived`}
            />
            <KPI
              icon={FileText}
              label="Blog"
              value={posts.length}
              sub={`${totals.postsInRange} published in range`}
            />
            <KPI
              icon={LayoutGrid}
              label="Templates"
              value={templates.length}
              sub={`${totals.templatesFeatured} featured`}
            />
          </div>

          {/* Top events table */}
          <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gold-light">Top events by RSVPs</h2>
              <TrendingUp className="h-4 w-4 text-gold-light/40" />
            </div>
            {topEvents.length === 0 ? (
              <p className="text-gold-light/40 text-sm py-6 text-center">
                No events have RSVP data yet — these will appear as guests respond.
              </p>
            ) : (
              <ul className="space-y-3">
                {topEvents.map((e) => {
                  const rsvp = Number(e.metadata?.rsvpCount ?? 0)
                  const pct = Math.round((rsvp / maxRsvp) * 100)
                  return (
                    <li key={e.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-gold-light truncate">{e.name}</p>
                          <span className="text-xs text-gold font-mono ml-2 shrink-0">{rsvp}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gold-dark to-gold-light"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Note about future work */}
          <p className="text-gold-light/30 text-xs mt-6 text-center">
            Charts powered by Firestore metadata counters. Add dedicated{" "}
            <span className="font-mono">pageViews</span> collection for time-series visualisation.
          </p>
        </>
      )}
    </Shell>
  )
}

function KPI({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType
  label: string
  value: number | string
  sub?: string
}) {
  return (
    <div className="bg-navy/60 border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-2 text-xs text-gold-light/50 uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      {value !== "" && (
        <p className="font-display text-3xl font-bold text-gold-light mt-2">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      )}
      {sub && <p className="text-[11px] text-gold-light/40 mt-1">{sub}</p>}
    </div>
  )
}

function Heart({ className }: { className?: string }) {
  // Inline SVG so we don't depend on lucide's heart in older builds.
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  )
}
