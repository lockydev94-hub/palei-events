"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react"
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext"
import { PageHeader, Card } from "@/components/customer/DashboardShell"
import {
  deleteMyEvent,
  subscribeToMyEvents,
  updateMyEvent,
} from "@/lib/customer"
import type { FirestoreEvent } from "@/lib/firestore"

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  published: { bg: "rgba(16,185,129,0.12)", color: "#059669" },
  draft: { bg: "rgba(245,158,11,0.12)", color: "#d97706" },
  archived: { bg: "rgba(107,114,128,0.12)", color: "#6b7280" },
}

export default function MyEventsPage() {
  const { user } = useCustomerAuth()
  const [events, setEvents] = useState<FirestoreEvent[] | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    return subscribeToMyEvents(user.uid, setEvents)
  }, [user?.uid])

  async function togglePublish(e: FirestoreEvent) {
    const next = e.status === "published" ? "draft" : "published"
    if (!e.id) return
    setBusyId(e.id)
    try {
      await updateMyEvent(e.id, { status: next })
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(e: FirestoreEvent) {
    if (!e.id) return
    if (!confirm(`Delete "${e.name}"? Its RSVPs and wish wall stay in your archives but the public page goes offline immediately.`)) return
    setBusyId(e.id)
    try {
      await deleteMyEvent(e.id)
    } finally {
      setBusyId(null)
    }
  }

  if (events === null) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="My events"
        subtitle="Create, edit and publish your event pages."
        action={
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.85rem] font-semibold text-navy-dark transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)" }}
          >
            <Plus className="h-4 w-4" /> New event
          </Link>
        }
      />

      {events.length === 0 ? (
        <Card className="p-14 text-center">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gold/40" />
          <p className="font-display text-lg font-semibold text-navy">Nothing here yet</p>
          <p className="mx-auto mt-1 max-w-sm text-[0.85rem] text-mutedText">
            Your events live here — with RSVPs, wishes and a shareable page for each one.
          </p>
          <Link
            href="/dashboard/events/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[0.85rem] font-semibold text-navy-dark"
            style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)" }}
          >
            <Plus className="h-4 w-4" /> Create an event
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((e) => {
            const badge = STATUS_STYLES[e.status] ?? STATUS_STYLES.draft
            const busy = busyId === e.id
            return (
              <Card key={e.id} className="p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <p className="font-semibold text-navy">{e.name}</p>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {e.status}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.8rem] text-mutedText">
                      {new Date(e.startDate).toLocaleDateString(undefined, {
                        weekday: "short", day: "numeric", month: "short", year: "numeric",
                      })}
                      {e.venue?.city ? ` · ${e.venue.city}` : ""}
                      {" · "}
                      /e/{e.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => togglePublish(e)}
                      disabled={busy}
                      className="rounded-lg px-3.5 py-2 text-[0.78rem] font-semibold transition-colors disabled:opacity-50"
                      style={{
                        background: e.status === "published" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                        color: e.status === "published" ? "#d97706" : "#059669",
                      }}
                    >
                      {busy ? "…" : e.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/dashboard/events/${e.id}`}
                      className="rounded-lg px-3.5 py-2 text-[0.78rem] font-semibold text-gold-dark transition-colors hover:bg-gold/10"
                    >
                      Edit
                    </Link>
                    {e.status === "published" && (
                      <Link
                        href={`/e/${e.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[0.78rem] text-mutedText hover:text-navy"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(e)}
                      disabled={busy}
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 disabled:opacity-50"
                      aria-label={`Delete ${e.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
