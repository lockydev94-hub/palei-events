"use client"

/**
 * Customer event editor — edit details, swap the hero, publish/unpublish,
 * or delete the event. Ownership enforced by Firestore rules.
 *
 * The form lives in a keyed child component so it re-initializes cleanly
 * once the event loads (no state-sync effect).
 */
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Save,
  Trash2,
} from "lucide-react"
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext"
import { PageHeader, Card } from "@/components/customer/DashboardShell"
import { ImageUploader } from "@/components/admin/ImageUploader"
import {
  subscribeToMyEvents,
  updateMyEvent,
  deleteMyEvent,
} from "@/lib/customer"
import type { FirestoreEvent } from "@/lib/firestore"
import { eventTypeMeta, type EventType } from "@/data/events"

export default function CustomerEventEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useCustomerAuth()

  const [event, setEvent] = useState<FirestoreEvent | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeToMyEvents(user.uid, (events) => {
      const mine = events.find((e) => e.id === id) ?? null
      setEvent(mine)
      setLoaded(true)
    })
    return () => unsub()
  }, [user?.uid, id])

  if (!loaded) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-gold" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-lg font-semibold text-navy">
          Event not found in your account
        </p>
        <Link
          href="/dashboard/events"
          className="mt-4 inline-block text-[0.88rem] font-semibold text-gold-dark hover:text-gold"
        >
          ← Back to my events
        </Link>
      </div>
    )
  }      return <EventEditorForm key={event.id} event={event} onDeleted={() => router.push("/dashboard/events")} />
}

/* ── Form (keyed by event id → fresh state per event) ───────────── */

function toLocalInput(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function EventEditorForm({
  event,
  onDeleted,
}: {
  event: FirestoreEvent
  onDeleted: () => void
}) {
  const [name, setName] = useState(event.name || "")
  const [type, setType] = useState<EventType>((event.type as EventType) || "wedding")
  const [startDate, setStartDate] = useState(event.startDate ? toLocalInput(event.startDate) : "")
  const [endDate, setEndDate] = useState(event.endDate ? toLocalInput(event.endDate) : "")
  const [venueName, setVenueName] = useState(event.venue?.name || "")
  const [venueCity, setVenueCity] = useState(event.venue?.city || "")
  const [description, setDescription] = useState(event.description || "")
  const [heroImage, setHeroImage] = useState(event.heroImage || "")
  const [status, setStatus] = useState(event.status)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      await updateMyEvent(event.id, {
        name: name.trim(),
        type,
        startDate: startDate ? new Date(startDate).toISOString() : event.startDate,
        ...(endDate ? { endDate: new Date(endDate).toISOString() } : {}),
        description: description.trim(),
        ...(venueName
          ? {
              venue: {
                ...(event.venue ?? { address: "", mapQuery: "" }),
                name: venueName.trim(),
                city: venueCity.trim(),
                mapQuery: `${venueName} ${venueCity}`.trim(),
              },
            }
          : {}),
        ...(heroImage ? { heroImage } : {}),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error("[customer] event save failed:", err)
      setError("Could not save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish() {
    const next = status === "published" ? "draft" : "published"
    try {
      await updateMyEvent(event.id, { status: next })
      setStatus(next)
    } catch (err) {
      console.error("[customer] publish toggle failed:", err)
      alert("Could not change publish state. Please try again.")
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        `Delete "${name || event.name}"? The public page goes offline immediately. This cannot be undone.`
      )
    )
      return
    try {
      await deleteMyEvent(event.id)
      onDeleted()
    } catch (err) {
      console.error("[customer] event delete failed:", err)
      alert("Could not delete the event. Please try again.")
    }
  }

  const labelCls = "mb-1.5 block text-[0.78rem] font-semibold text-navy"
  const inputCls =
    "w-full rounded-xl px-4 py-3 text-[0.9rem] text-navy outline-none transition-all placeholder:text-mutedText/50 focus:border-gold focus:ring-2 focus:ring-gold/15"
  const inputStyle = {
    background: "rgba(255,253,248,0.95)",
    border: "1px solid rgba(23,32,51,0.12)",
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/dashboard/events"
        className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-mutedText transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All events
      </Link>

      <PageHeader
        title={name || event.name}
        subtitle={
          status === "published"
            ? "Live — guests can RSVP and post wishes."
            : "Draft — publish it to share with guests."
        }
        action={
          <div className="flex items-center gap-2">
            {status === "published" && (
              <Link
                href={`/e/${event.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-[0.82rem] font-medium text-navy transition-colors hover:bg-gold/10"
                style={{ borderColor: "rgba(23,32,51,0.15)" }}
              >
                <ExternalLink className="h-3.5 w-3.5" /> View live
              </Link>
            )}
            <button
              type="button"
              onClick={togglePublish}
              className="rounded-xl px-4 py-2.5 text-[0.82rem] font-semibold text-navy-dark transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)" }}
            >
              {status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="grid gap-6">
        <Card className="p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="ed-name" className={labelCls}>Event name</label>
              <input
                id="ed-name"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Event type</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(eventTypeMeta).map(([key, meta]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setType(key as EventType)}
                    className="rounded-xl px-4 py-2.5 text-[0.82rem] font-medium transition-all"
                    style={
                      type === key
                        ? {
                            background: "linear-gradient(135deg, rgba(200,155,60,0.16), rgba(200,155,60,0.06))",
                            border: "1.5px solid rgba(200,155,60,0.55)",
                            color: "#a67f2e",
                          }
                        : { border: "1px solid rgba(23,32,51,0.12)", color: "#374151", background: "rgba(255,253,248,0.8)" }
                    }
                  >
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="ed-start" className={labelCls}>Starts</label>
              <input
                id="ed-start"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="ed-end" className={labelCls}>Ends <span className="font-normal text-mutedText">(optional)</span></label>
              <input
                id="ed-end"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="ed-venue" className={labelCls}>Venue</label>
              <input
                id="ed-venue"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="ed-city" className={labelCls}>City</label>
              <input
                id="ed-city"
                value={venueCity}
                onChange={(e) => setVenueCity(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ed-desc" className={labelCls}>Description</label>
              <textarea
                id="ed-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputCls} resize-none`}
                style={inputStyle}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <label className={labelCls}>Hero image</label>
          <ImageUploader
            value={heroImage}
            onUpload={(url) => setHeroImage(url)}
            label="Event hero"
            folder="events/hero"
            aspectRatio={16 / 9}
            targetWidth={1920}
          />
        </Card>

        {saved && (
          <p
            className="rounded-xl px-4 py-3 text-[0.85rem]"
            style={{ background: "rgba(16,185,129,0.08)", color: "#047857" }}
            role="status"
          >
            Changes saved ✓
          </p>
        )}
        {error && (
          <p
            className="rounded-xl px-4 py-3 text-[0.85rem]"
            style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c" }}
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.85rem] font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete event
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-[0.9rem] font-semibold text-navy-dark transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #e0c584, #c89b3c)",
              boxShadow: "0 0 28px rgba(200,155,60,0.35)",
            }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
