"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Shell from "@/components/admin/Shell"
import { getEvents, deleteEvent, type FirestoreEvent } from "@/lib/firestore"
import { demoEvents } from "@/data/events"
import { eventTypeMeta } from "@/data/events"
import { useAuth } from "@/components/admin/auth/AuthContext"
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Filter,
  ExternalLink,
} from "lucide-react"

export default function EventsPage() {
  const [events, setEvents] = useState<FirestoreEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [deleting, setDeleting] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setLoading(true)
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (err) {
      console.error("Failed to load events:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tagline?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || event.type === filterType
    const matchesStatus = filterStatus === "all" || event.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event? This action is permanent but will be recorded in the audit log.")) return
    setDeleting(id)
    try {
      await deleteEvent(id, {
        actor: user ? { uid: user.uid, email: user.email } : undefined,
      })
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error("Failed to delete event:", err)
      alert("Failed to delete event")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Shell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gold-light">Events</h1>
          <p className="text-gold-light/50 text-sm mt-1">
            Manage all events — {events.length} total
          </p>
        </div>
        <a
          href="/admin/events/new"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-light/40" />
          <input
            type="text"
            placeholder="Search events…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors placeholder:text-gold-light/30"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-light/40" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-navy/60 border border-white/10 rounded-lg pl-10 pr-8 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            {Object.entries(eventTypeMeta).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-navy/60 border border-white/10 rounded-lg pl-4 pr-8 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-navy/60 border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gold-light/40 text-sm">Loading events…</div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gold-light/20 mx-auto mb-3" />
            <p className="text-gold-light/50 text-sm">No events found</p>
            <a
              href="/admin/events/new"
              className="inline-flex items-center gap-2 mt-4 text-gold text-sm font-medium hover:text-gold-light transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create your first event
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider hidden md:table-cell">
                    Type
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gold-light">{event.name}</p>
                        <p className="text-xs text-gold-light/40 mt-0.5 truncate max-w-xs">
                          {event.tagline}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs text-gold-light/60 capitalize">{event.type}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs text-gold-light/60">
                        {event.startDate
                          ? new Date(event.startDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          event.status === "published"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : event.status === "draft"
                            ? "bg-yellow-500/15 text-yellow-400"
                            : "bg-gold/15 text-gold"
                        }`}
                      >
                        {event.status || "published"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="p-2 rounded-md hover:bg-gold/10 transition-colors text-gold-light/50 hover:text-gold-light"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <a
                          href={`/e/${event.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-md hover:bg-gold/10 transition-colors text-gold-light/50 hover:text-gold-light"
                          title="Open public page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a
                          href={`/admin/events/${event.id}/edit`}
                          className="p-2 rounded-md hover:bg-gold/10 transition-colors text-gold-light/50 hover:text-gold-light"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(event.id)}
                          disabled={deleting === event.id}
                          className="p-2 rounded-md hover:bg-red-500/10 transition-colors text-gold-light/50 hover:text-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
