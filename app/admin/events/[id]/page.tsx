"use client"

import { useEffect, use, useState } from "react"
import Link from "next/link"
import Shell from "@/components/admin/Shell"
import { getEventById, deleteEvent, type FirestoreEvent } from "@/lib/firestore"
import { demoEvents } from "@/data/events"
import { useAuth } from "@/components/admin/auth/AuthContext"
import { ArrowLeft, ExternalLink, Edit, Trash2, Loader2, AlertTriangle, Eye, Users, Image as ImageIcon, Heart, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<FirestoreEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        let ev = await getEventById(id)
        if (!ev) {
          const demo = demoEvents.find((e) => e.id === id)
          if (demo) ev = demo as FirestoreEvent
        }
        if (cancelled) return
        if (!ev) {
          setError("Event not found")
        } else {
          setEvent(ev)
        }
      } catch {
        setError("Failed to load event")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const handleDelete = async () => {
    if (!event) return
    const confirmed = confirm(
      `Delete "${event.name}"? This is permanent. The audit log will still record the action.`
    )
    if (!confirmed) return
    setDeleting(true)
    try {
      await deleteEvent(id, {
        actor: user ? { uid: user.uid, email: user.email } : undefined,
      ctx: "admin",
      })
      router.replace("/admin/events")
    } catch (err: any) {
      setError(err.message || "Delete failed")
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </Shell>
    )
  }

  if (error || !event) {
    return (
      <Shell>
        <div className="text-center py-20">
          <p className="text-gold-light/50">{error || "Event not found"}</p>
          <Link href="/admin/events" className="text-gold text-sm mt-4 inline-block hover:text-gold-light">
            ← Back to events
          </Link>
        </div>
      </Shell>
    )
  }

  const statusTone =
    event.status === "published"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : event.status === "archived"
      ? "bg-navy/50 text-gold-light/50 border-white/10"
      : "bg-amber-500/15 text-amber-300 border-amber-500/30"

  return (
    <Shell>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <Link
          href="/admin/events"
          className="p-2 rounded-md hover:bg-gold/10 transition-colors"
          aria-label="Back to events"
        >
          <ArrowLeft className="h-5 w-5 text-gold-light" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-gold-light truncate">
              {event.name}
            </h1>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusTone}`}>
              {event.status}
            </span>
          </div>
          <p className="text-gold-light/50 text-sm mt-1 font-mono">/e/{event.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/e/${event.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gold-light/80 hover:text-gold-light transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View live
          </Link>
          <Link
            href={`/admin/events/${id}/edit`}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-gold hover:bg-gold-light text-navy-dark font-semibold transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={Eye}
          label="Page views"
          value={(event.metadata?.rsvpCount ?? 0).toLocaleString()}
          hint="Live from RSVP counter"
        />
        <StatCard
          icon={Users}
          label="RSVPs"
          value={(event.metadata?.rsvpCount ?? 0).toLocaleString()}
          hint="Includes +1s"
        />
        <StatCard
          icon={ImageIcon}
          label="Gallery items"
          value={(event.gallery?.length ?? event.metadata?.galleryItemCount ?? 0).toLocaleString()}
        />
        <StatCard
          icon={Heart}
          label="Wishes"
          value={(event.wishes?.length ?? event.metadata?.wishCount ?? 0).toLocaleString()}
        />
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Overview">
            <p className="text-gold-light/80 text-sm whitespace-pre-wrap leading-relaxed">
              {event.description || "No description."}
            </p>
            {event.tagline && (
              <p className="mt-3 text-gold-light/50 text-xs italic">“{event.tagline}”</p>
            )}
          </Panel>

          <Panel title="Schedule" right={
            <span className="text-xs text-gold-light/40">{event.schedule?.length ?? 0} items</span>
          }>
            {event.schedule && event.schedule.length > 0 ? (
              <ol className="space-y-2">
                {event.schedule.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-gold font-mono text-xs w-16 shrink-0 pt-0.5">{s.time}</span>
                    <div>
                      <p className="text-gold-light">{s.title}</p>
                      {s.description && (
                        <p className="text-gold-light/50 text-xs">{s.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gold-light/40 text-sm">No schedule items.</p>
            )}
          </Panel>

          <Panel title="Gallery" right={
            <span className="text-xs text-gold-light/40">{event.gallery?.length ?? 0} items</span>
          }>
            {event.gallery && event.gallery.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {event.gallery.slice(0, 9).map((g, i) => (
                  <a
                    key={i}
                    href={g.src}
                    target="_blank"
                    rel="noreferrer"
                    className="aspect-square rounded-lg overflow-hidden bg-navy-dark border border-white/5 hover:border-gold/30 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.src}
                      alt={g.alt}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gold-light/40 text-sm">No gallery items yet.</p>
            )}
          </Panel>

          <Panel title="Wishes" right={
            <span className="text-xs text-gold-light/40">{event.wishes?.length ?? 0} wishes</span>
          }>
            {event.wishes && event.wishes.length > 0 ? (
              <ul className="space-y-3">
                {event.wishes.slice(0, 5).map((w, i) => (
                  <li key={i} className="text-sm">
                    <p className="text-gold-light/80">"{w.message}"</p>
                    <p className="text-gold-light/40 text-xs mt-1">
                      — {w.name}{w.relation ? `, ${w.relation}` : ""}
                    </p>
                  </li>
                ))}
                {event.wishes.length > 5 && (
                  <p className="text-gold-light/40 text-xs">+ {event.wishes.length - 5} more</p>
                )}
              </ul>
            ) : (
              <p className="text-gold-light/40 text-sm">No wishes yet.</p>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Details">
            <dl className="space-y-3 text-sm">
              <Row icon={Calendar} label="Date">
                {event.startDate ? new Date(event.startDate).toLocaleString() : "—"}
                {event.endDate && (
                  <span className="block text-gold-light/50 text-xs">
                    → {new Date(event.endDate).toLocaleString()}
                  </span>
                )}
              </Row>
              {event.venue?.name && (
                <Row icon={MapPin} label="Venue">
                  {event.venue.name}
                  {event.venue.city && (
                    <span className="block text-gold-light/50 text-xs">{event.venue.city}</span>
                  )}
                </Row>
              )}
              <Row label="Type">
                <span className="capitalize">{event.type}</span>
              </Row>
              <Row label="Doc version">
                <span className="font-mono">v{event.metadata?.version ?? 0}</span>
              </Row>
              {event.metadata?.publishedAt && (
                <Row label="Published">
                  {new Date(event.metadata.publishedAt).toLocaleDateString()}
                </Row>
              )}
            </dl>
          </Panel>

          <Panel title="Theme">
            <div className="grid grid-cols-3 gap-2">
              <ColorSwatch label="Primary" value={event.theme?.primaryColor} />
              <ColorSwatch label="Secondary" value={event.theme?.secondaryColor} />
              <ColorSwatch label="Background" value={event.theme?.backgroundColor} />
            </div>
            {event.theme?.fontHeading && (
              <p className="text-gold-light/50 text-xs mt-3">
                Heading: <span className="text-gold-light/80">{event.theme.fontHeading}</span>
                {" · "}
                Body: <span className="text-gold-light/80">{event.theme.fontBody}</span>
              </p>
            )}
          </Panel>

          <Panel title="Metadata">
            <dl className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <dt className="text-gold-light/40">id</dt>
                <dd className="text-gold-light/80 truncate ml-3 max-w-[160px]">{id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gold-light/40">version</dt>
                <dd className="text-gold-light/80">v{event.metadata?.version ?? 0}</dd>
              </div>
              {event.createdAt && (
                <div className="flex justify-between">
                  <dt className="text-gold-light/40">created</dt>
                  <dd className="text-gold-light/80">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {event.updatedAt && (
                <div className="flex justify-between">
                  <dt className="text-gold-light/40">updated</dt>
                  <dd className="text-gold-light/80">
                    {new Date(event.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}

function Panel({
  title,
  children,
  right,
}: {
  title: string
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gold-light">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="bg-navy/60 border border-white/5 rounded-xl p-4">
      <div className="flex items-center gap-2 text-gold-light/50 text-xs">
        <Icon className="h-3.5 w-3.5" />
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-display font-semibold text-gold-light">{value}</p>
      {hint && <p className="text-[10px] text-gold-light/40 mt-1">{hint}</p>}
    </div>
  )
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon?: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-4 w-4 text-gold-light/40 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <dt className="text-gold-light/40 text-xs uppercase tracking-wider">{label}</dt>
        <dd className="text-gold-light text-sm mt-0.5">{children}</dd>
      </div>
    </div>
  )
}

function ColorSwatch({ label, value }: { label: string; value?: string }) {
  return (
    <div className="text-center">
      <div
        className="aspect-square rounded-lg border border-white/10 mb-1.5"
        style={{ background: value || "#0f1522" }}
        aria-label={label}
      />
      <p className="text-gold-light/40 text-[10px] uppercase tracking-wider">{label}</p>
      <p className="text-gold-light/60 text-[10px] font-mono">{value || "—"}</p>
    </div>
  )
}
