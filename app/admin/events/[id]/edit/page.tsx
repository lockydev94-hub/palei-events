"use client"

import { useState, useEffect, use, useCallback } from "react"
import { useRouter } from "next/navigation"
import Shell from "@/components/admin/Shell"
import {
  getEventById,
  updateEvent,
  type FirestoreEvent,
} from "@/lib/firestore"
import { demoEvents, eventTypeMeta } from "@/data/events"
import { useAuth } from "@/components/admin/auth/AuthContext"
import { ImageUploader } from "@/components/admin/ImageUploader"
import {
  Save, ArrowLeft, Loader2, Trash2, Plus, AlertTriangle, CheckCircle2, Upload,
} from "lucide-react"


type Tab = "overview" | "schedule" | "gallery" | "wishes" | "rsvps"

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tab, setTab] = useState<Tab>("overview")

  // Snapshot for the audit log (what was in Firestore before we wrote).
  const [before, setBefore] = useState<FirestoreEvent | null>(null)

  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "wedding" as string,
    tagline: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "published" as "draft" | "published" | "archived",
    venueName: "",
    venueAddress: "",
    venueCity: "",
    venueMapQuery: "",
    heroImage: "",
    themePrimary: "#c89b3c",
    themeSecondary: "#172033",
    themeBackground: "#0f1522",
    themeHeadingFont: "Playfair Display",
    themeBodyFont: "Manrope",
  })

  // Nested editors — kept as arrays of plain objects so we can render
  // add/remove rows without fancy nested state.
  const [schedule, setSchedule] = useState<
    { time: string; title: string; description?: string }[]
  >([])
  const [gallery, setGallery] = useState<
    { src: string; alt: string; caption?: string }[]
  >([])
  const [wishes, setWishes] = useState<
    { name: string; message: string; relation?: string }[]
  >([])

  useEffect(() => {
    async function load() {
      try {
        let event: FirestoreEvent | null = await getEventById(id)
        if (!event) {
          const demoEvent = demoEvents.find((e) => e.id === id)
          if (demoEvent) event = demoEvent as FirestoreEvent
        }
        if (!event) {
          setError("Event not found")
          setLoading(false)
          return
        }
        setBefore(event)
        setForm({
          name: event.name || "",
          slug: event.slug || "",
          type: event.type || "wedding",
          tagline: event.tagline || "",
          description: event.description || "",
          startDate: event.startDate ? event.startDate.slice(0, 16) : "",
          endDate: event.endDate ? event.endDate.slice(0, 16) : "",
          status: (event.status as any) || "published",
          venueName: event.venue?.name || "",
          venueAddress: event.venue?.address || "",
          venueCity: event.venue?.city || "",
          venueMapQuery: event.venue?.mapQuery || "",
          heroImage: event.heroImage || "",
          themePrimary: event.theme?.primaryColor || "#c89b3c",
          themeSecondary: event.theme?.secondaryColor || "#172033",
          themeBackground: event.theme?.backgroundColor || "#0f1522",
          themeHeadingFont: event.theme?.fontHeading || "Playfair Display",
          themeBodyFont: event.theme?.fontBody || "Manrope",
        })
        setSchedule(event.schedule || [])
        setGallery(event.gallery || [])
        setWishes(event.wishes || [])
      } catch (err) {
        setError("Failed to load event")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
    setSuccess(false)
  }

  const save = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      setSaving(true)
      setError(null)
      try {
        // Only attach a `venue` object when at least one of its fields is
        // non-empty. The previous version always wrote a `venue: { ... }`
        // object even when every field was "", which made doc diffs noisy
        // and inflated storage with empty containers.
        const hasVenue =
          form.venueName || form.venueAddress || form.venueCity || form.venueMapQuery
        const venue = hasVenue
          ? {
              name: form.venueName,
              address: form.venueAddress,
              city: form.venueCity,
              mapQuery: form.venueMapQuery,
            }
          : undefined

        await updateEvent(
          id,
          {
            name: form.name,
            slug: form.slug,
            type: form.type as any,
            tagline: form.tagline,
            description: form.description,
            startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
            endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
            status: form.status as any,
            venue,
            heroImage: form.heroImage || undefined,
            theme: {
              primaryColor: form.themePrimary,
              secondaryColor: form.themeSecondary,
              backgroundColor: form.themeBackground,
              fontHeading: form.themeHeadingFont,
              fontBody: form.themeBodyFont,
            },
            schedule,
            gallery,
            wishes,
          },
          { actor: user ? { uid: user.uid, email: user.email } : undefined }
        )
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (err: any) {
        setError(err.message || "Failed to save event")
      } finally {
        setSaving(false)
      }
    },
    [form, id, schedule, gallery, wishes, user]
  )

  // ── Loading / error states ─────────────────────────────────────
  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </Shell>
    )
  }
  if (error && !form.name) {
    return (
      <Shell>
        <div className="text-center py-20">
          <p className="text-gold-light/50">{error}</p>
          <a href="/admin/events" className="text-gold text-sm mt-4 inline-block hover:text-gold-light">
            ← Back to events
          </a>
        </div>
      </Shell>
    )
  }

  const version = before?.metadata?.version ?? 0
  const nextVersion = version + 1

  return (
    <Shell>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-md hover:bg-gold/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-gold-light" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-gold-light">Edit Event</h1>
          <p className="text-gold-light/50 text-sm mt-0.5">Editing: {form.name}</p>
        </div>
        <div className="text-right text-xs text-gold-light/40 hidden sm:block">
          <p>Doc id: <span className="font-mono">{id}</span></p>
          <p>
            Version{" "}
            <span className="text-gold-light/70">v{version}</span> →{" "}
            <span className="text-gold-light/70">v{nextVersion}</span>
          </p>
        </div>
      </div>

      {/* Status messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-emerald-400 text-sm">Event saved (metadata.version bumped to v{nextVersion}).</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-white/5">
        {(["overview", "schedule", "gallery", "wishes", "rsvps"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize transition-colors ${
              tab === t
                ? "text-gold-light border-b-2 border-gold"
                : "text-gold-light/50 hover:text-gold-light/80"
            }`}
          >
            {t}
            {t === "schedule" && schedule.length > 0 && (
              <span className="ml-1.5 text-[10px] text-gold/70">({schedule.length})</span>
            )}
            {t === "gallery" && gallery.length > 0 && (
              <span className="ml-1.5 text-[10px] text-gold/70">({gallery.length})</span>
            )}
            {t === "wishes" && wishes.length > 0 && (
              <span className="ml-1.5 text-[10px] text-gold/70">({wishes.length})</span>
            )}
          </button>
        ))}
      </div>

      <form onSubmit={save} className="space-y-6">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <>
            <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gold-light mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Event Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    {Object.entries(eventTypeMeta).map(([key, meta]) => (
                      <option key={key} value={key}>{meta.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Tagline</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={4}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gold-light mb-4">Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gold-light mb-4">Venue</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Venue Name</label>
                  <input
                    type="text"
                    value={form.venueName}
                    onChange={(e) => updateField("venueName", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">City</label>
                  <input
                    type="text"
                    value={form.venueCity}
                    onChange={(e) => updateField("venueCity", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Address</label>
                  <input
                    type="text"
                    value={form.venueAddress}
                    onChange={(e) => updateField("venueAddress", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Map Query</label>
                  <input
                    type="text"
                    value={form.venueMapQuery}
                    onChange={(e) => updateField("venueMapQuery", e.target.value)}
                    placeholder="e.g. Kalinga Stadium, Bhubaneswar"
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors placeholder:text-gold-light/30"
                  />
                </div>
              </div>
            </div>

            <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gold-light mb-4">Theme</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ColorField label="Primary" value={form.themePrimary} onChange={(v) => updateField("themePrimary", v)} />
                <ColorField label="Secondary" value={form.themeSecondary} onChange={(v) => updateField("themeSecondary", v)} />
                <ColorField label="Background" value={form.themeBackground} onChange={(v) => updateField("themeBackground", v)} />
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Heading Font</label>
                  <input
                    type="text"
                    value={form.themeHeadingFont}
                    onChange={(e) => updateField("themeHeadingFont", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Body Font</label>
                  <input
                    type="text"
                    value={form.themeBodyFont}
                    onChange={(e) => updateField("themeBodyFont", e.target.value)}
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gold-light mb-4">Media</h2>
              <ImageUploader
                label="Hero Image"
                value={form.heroImage}
                onUpload={(url) => updateField("heroImage", url)}
                folder="palei-events/events/hero"
                aspectRatio={16 / 9}
                targetWidth={1920}
                targetHeight={1080}
                hint="Recommended: 1920×1080px (16:9). JPG, PNG, WebP up to 10 MB."
              />
              {form.heroImage && (
                <p className="mt-2 text-[10px] text-gold-light/30 font-mono truncate">{form.heroImage}</p>
              )}
            </div>
          </>
        )}

        {/* SCHEDULE editor */}
        {tab === "schedule" && (
          <ArrayEditor
            title="Schedule Items"
            items={schedule}
            onChange={setSchedule}
            emptyText="No schedule items yet — add one to show guests the event programme."
            fields={[
              { key: "time", label: "Time", placeholder: "4:30 PM", span: 1 },
              { key: "title", label: "Title", placeholder: "Reception begins", span: 2 },
              { key: "description", label: "Description (optional)", placeholder: "Notes for guests", span: 3 },
            ]}
          />
        )}

        {/* GALLERY editor */}
        {tab === "gallery" && (
          <GalleryEditor gallery={gallery} onChange={setGallery} />
        )}

        {/* WISHES */}
        {tab === "wishes" && (
          <div className="space-y-4">
            <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gold-light mb-1">Wishes</h2>
              <p className="text-gold-light/50 text-xs">
                Wishes submitted by guests on the public event page will appear here. You can also add a
                wish manually (useful for adding a personal note to the wall).
              </p>
            </div>
            <ArrayEditor
              title="Manual Wishes"
              items={wishes}
              onChange={setWishes}
              emptyText="No manual wishes yet."
              fields={[
                { key: "name", label: "From", placeholder: "Aarav & Ananya", span: 1 },
                { key: "relation", label: "Relation (optional)", placeholder: "Friend", span: 1 },
                { key: "message", label: "Message", placeholder: "Wishing you both a beautiful journey…", span: 3 },
              ]}
            />
          </div>
        )}

        {/* RSVPS (read-only) */}
        {tab === "rsvps" && (
          <div className="bg-navy/60 border border-white/5 rounded-xl p-6 text-center">
            <p className="text-gold-light/60 text-sm">
              RSVPs are collected from the public event page and stored under{" "}
              <span className="font-mono text-gold-light/80">events/{"<id>"}/rsvps</span>.
              The viewer UI is part of the next phase — for now you can see live counts in the
              dashboard.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 sticky bottom-0 bg-navy-dark/80 backdrop-blur-sm -mx-6 px-6 py-4 border-t border-white/5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
          <a
            href="/admin/events"
            className="px-4 py-2.5 text-sm text-gold-light/60 hover:text-gold-light transition-colors"
          >
            Cancel
          </a>
          {before && (
            <p className="ml-auto text-xs text-gold-light/40 hidden sm:block">
              Last updated {before.updatedAt ? new Date(before.updatedAt).toLocaleString() : "—"}
            </p>
          )}
        </div>
      </form>
    </Shell>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-gold-light/60 text-xs font-medium mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 rounded border border-white/10 bg-navy-dark cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-navy-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors font-mono"
        />
      </div>
    </div>
  )
}

interface ArrayEditorField {
  key: string
  label: string
  placeholder?: string
  span?: number
}

function ArrayEditor<T extends Record<string, any>>({
  title,
  items,
  onChange,
  emptyText,
  fields,
}: {
  title: string
  items: T[]
  onChange: (next: T[]) => void
  emptyText: string
  fields: ArrayEditorField[]
}) {
  const update = (i: number, key: string, value: string) => {
    const next = items.slice()
    next[i] = { ...next[i], [key]: value }
    onChange(next)
  }
  const remove = (i: number) => {
    const next = items.slice()
    next.splice(i, 1)
    onChange(next)
  }
  const add = () => {
    onChange([...items, fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {} as T)])
  }
  return (
    <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gold-light">{title}</h2>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          Add row
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-gold-light/40 text-sm py-4">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end bg-navy-dark/40 rounded-lg p-3">
              {fields.map((f) => (
                <div
                  key={f.key}
                  className={`md:col-span-${f.span ?? 1} col-span-1`}
                >
                  <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={item[f.key] ?? ""}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-navy-dark border border-white/10 rounded px-2 py-1.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => remove(i)}
                className="md:col-span-1 h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-red-500/10 text-red-400/70 hover:text-red-400 transition-colors"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Gallery Editor with Cloudinary uploads ─────────────────────────────────────
function GalleryEditor({
  gallery,
  onChange,
}: {
  gallery: { src: string; alt: string; caption?: string }[]
  onChange: (next: { src: string; alt: string; caption?: string }[]) => void
}) {
  function updateItem(i: number, key: string, value: string) {
    const next = gallery.slice()
    next[i] = { ...next[i], [key]: value }
    onChange(next)
  }

  function removeItem(i: number) {
    const next = gallery.slice()
    next.splice(i, 1)
    onChange(next)
  }

  function addItem(url: string) {
    onChange([...gallery, { src: url, alt: "", caption: "" }])
  }

  return (
    <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gold-light">Gallery</h2>
          <p className="text-[10px] text-gold-light/40 mt-0.5">
            Upload photos · Recommended: 1200×900px (4:3)
          </p>
        </div>
        <span className="text-xs text-gold-light/40">{gallery.length} photos</span>
      </div>

      {/* Upload new photo */}
      <div className="mb-5 p-4 bg-navy-dark/40 rounded-lg border border-dashed border-white/10">
        <ImageUploader
          label="Add photo to gallery"
          onUpload={(url) => { if (url) addItem(url) }}
          folder="palei-events/events/gallery"
          aspectRatio={4 / 3}
          targetWidth={1200}
          targetHeight={900}
          hint="Recommended: 1200×900px (4:3). Saved and added to gallery automatically."
        />
      </div>

      {/* Photo grid */}
      {gallery.length === 0 ? (
        <p className="text-gold-light/40 text-sm py-4 text-center">
          No photos yet — upload one above or they will appear here from the RSVP form.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {gallery.map((item, i) => (
            <div key={i} className="group relative bg-navy-dark rounded-lg overflow-hidden border border-white/5">
              {/* Thumbnail */}
              {item.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.src} alt={item.alt || "Gallery photo"} className="w-full aspect-[4/3] object-cover" />
              ) : (
                <div className="w-full aspect-[4/3] flex items-center justify-center text-gold-light/20">
                  <Upload className="h-8 w-8" />
                </div>
              )}

              {/* Remove button overlay */}
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white/70 hover:text-red-400 hover:bg-black opacity-0 group-hover:opacity-100 transition-all"
                title="Remove"
              >
                <Trash2 className="h-3 w-3" />
              </button>

              {/* Alt & caption */}
              <div className="p-2 space-y-1">
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => updateItem(i, "alt", e.target.value)}
                  placeholder="Alt text"
                  className="w-full bg-transparent border-b border-white/10 px-0 py-0.5 text-[11px] text-gold-light/70 outline-none focus:border-gold/40 placeholder:text-gold-light/20"
                />
                <input
                  type="text"
                  value={item.caption ?? ""}
                  onChange={(e) => updateItem(i, "caption", e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-full bg-transparent border-b border-white/10 px-0 py-0.5 text-[11px] text-gold-light/40 outline-none focus:border-gold/40 placeholder:text-gold-light/20"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
