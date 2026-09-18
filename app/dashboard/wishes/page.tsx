"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Heart, Loader2, Trash2 } from "lucide-react"
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext"
import { PageHeader, Card } from "@/components/customer/DashboardShell"
import {
  subscribeToWishes,
  subscribeToMyEvents,
  deleteWish,
  type Wish,
} from "@/lib/customer"
import type { FirestoreEvent } from "@/lib/firestore"

export default function CustomerWishesPage() {
  const { user } = useCustomerAuth()
  const [wishes, setWishes] = useState<Wish[] | null>(null)
  const [events, setEvents] = useState<FirestoreEvent[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const unsubW = subscribeToWishes(user.uid, setWishes)
    const unsubE = subscribeToMyEvents(user.uid, (es) => setEvents(es))
    return () => {
      unsubW()
      unsubE()
    }
  }, [user?.uid])

  const eventsById = useMemo(() => new Map(events.map((e) => [e.id, e])), [events])

  async function handleDelete(id: string) {
    if (!confirm("Remove this wish from your wall?")) return
    setDeleting(id)
    try {
      await deleteWish(id)
    } finally {
      setDeleting(null)
    }
  }

  if (wishes === null) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Wish wall"
        subtitle="Messages your guests left on your event pages."
      />

      {wishes.length === 0 ? (
        <Card className="p-14 text-center">
          <Heart className="mx-auto mb-3 h-10 w-10 text-gold/40" />
          <p className="font-display text-lg font-semibold text-navy">No wishes yet</p>
          <p className="mx-auto mt-1 max-w-sm text-[0.85rem] text-mutedText">
            Guests can post wishes from your live event page — they show up here instantly.
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishes.map((w) => {
            const event = eventsById.get(w.eventId)
            return (
              <Card key={w.id} className="flex flex-col p-5">
                <p className="flex-1 font-display text-[0.95rem] italic leading-relaxed text-navy">
                  &ldquo;{w.message}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t pt-3" style={{ borderColor: "rgba(200,155,60,0.15)" }}>
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[0.65rem] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #9b7acb, #7054a8)" }}
                  >
                    {(w.name || "?").slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.82rem] font-semibold text-navy">{w.name}</p>
                    <p className="truncate text-[0.7rem] text-mutedText">
                      {event ? event.name : "Unknown event"}
                      {w.relation ? ` · ${w.relation}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(w.id)}
                    disabled={deleting === w.id}
                    className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 disabled:opacity-40"
                    aria-label="Delete wish"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
