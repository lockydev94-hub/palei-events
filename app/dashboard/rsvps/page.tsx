"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2, Mail, Users } from "lucide-react"
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext"
import { PageHeader, Card } from "@/components/customer/DashboardShell"
import { subscribeToRsvps, subscribeToMyEvents, type Rsvp } from "@/lib/customer"
import type { FirestoreEvent } from "@/lib/firestore"

export default function CustomerRsvpsPage() {
  const { user } = useCustomerAuth()
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null)
  const [events, setEvents] = useState<FirestoreEvent[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    if (!user) return
    const unsubR = subscribeToRsvps(user.uid, setRsvps)
    const unsubE = subscribeToMyEvents(user.uid, (es) =>
      setEvents(es.filter((e) => e.status === "published"))
    )
    return () => {
      unsubR()
      unsubE()
    }
  }, [user?.uid])

  const eventsById = useMemo(
    () => new Map(events.map((e) => [e.id, e])),
    [events]
  )
  const filtered = useMemo(
    () => (filter === "all" ? rsvps ?? [] : (rsvps ?? []).filter((r) => r.eventId === filter)),
    [rsvps, filter]
  )
  const totalGuests = useMemo(
    () =>
      filtered.reduce((sum, r) => {
        const n = parseInt(r.guests, 10)
        return sum + (Number.isFinite(n) ? n : 1)
      }, 0),
    [filtered]
  )

  if (rsvps === null) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Guest RSVPs"
        subtitle="Live responses from your event pages."
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mutedText">Responses</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy">{filtered.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mutedText">Total guests</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy">{totalGuests}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mutedText">Published events</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy">{events.length}</p>
        </Card>
      </div>

      {/* Event filter */}
      {events.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className="rounded-xl px-4 py-2 text-[0.8rem] font-medium transition-all"
            style={
              filter === "all"
                ? { background: "rgba(200,155,60,0.12)", border: "1.5px solid rgba(200,155,60,0.5)", color: "#a67f2e" }
                : { border: "1px solid rgba(23,32,51,0.12)", color: "#374151" }
            }
          >
            All events
          </button>
          {events.map((e) => (
            <button
              key={e.id}
              onClick={() => setFilter(e.id)}
              className="max-w-[220px] truncate rounded-xl px-4 py-2 text-[0.8rem] font-medium transition-all"
              style={
                filter === e.id
                  ? { background: "rgba(200,155,60,0.12)", border: "1.5px solid rgba(200,155,60,0.5)", color: "#a67f2e" }
                  : { border: "1px solid rgba(23,32,51,0.12)", color: "#374151" }
              }
            >
              {e.name}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="p-14 text-center">
          <Mail className="mx-auto mb-3 h-10 w-10 text-gold/40" />
          <p className="font-display text-lg font-semibold text-navy">No RSVPs yet</p>
          <p className="mx-auto mt-1 max-w-sm text-[0.85rem] text-mutedText">
            Publish an event and share the link — responses appear here in real time.
          </p>
          <Link
            href="/dashboard/events"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[0.85rem] font-semibold text-navy-dark"
            style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)" }}
          >
            Go to my events
          </Link>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => {
            const event = eventsById.get(r.eventId)
            return (
              <Card key={r.id} className="flex flex-wrap items-center gap-4 p-5">
                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[0.72rem] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                >
                  {(r.name || "?").slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{r.name}</p>
                  <p className="text-[0.78rem] text-mutedText">
                    {event ? event.name : "Unknown event"}
                    {r.message ? ` · “${r.message.slice(0, 60)}${r.message.length > 60 ? "…" : ""}”` : ""}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.78rem] font-semibold"
                  style={{ background: "rgba(59,130,246,0.10)", color: "#1d4ed8" }}
                >
                  <Users className="h-3.5 w-3.5" />
                  {r.guests}
                </span>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
