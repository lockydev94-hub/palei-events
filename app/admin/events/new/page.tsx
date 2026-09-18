"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Shell from "@/components/admin/Shell"
import { createEvent } from "@/lib/firestore"
import { eventTypeMeta } from "@/data/events"
import { slugify } from "@/lib/utils"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { Save, ArrowLeft, Loader2 } from "lucide-react"

export default function NewEventPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "wedding",
    tagline: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "draft",
    venueName: "",
    venueAddress: "",
    venueCity: "",
    venueMapQuery: "",
    heroImage: "",
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // Auto-generate slug from name
      if (field === "name" && !prev.slug) {
        next.slug = slugify(value)
      }
      return next
    })
    setError(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError("Event name is required")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const eventId = await createEvent({
        name: form.name,
        slug: form.slug || slugify(form.name),
        type: form.type as any,
        tagline: form.tagline,
        description: form.description,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        status: form.status as any,
        venue: {
          name: form.venueName,
          address: form.venueAddress,
          city: form.venueCity,
          mapQuery: form.venueMapQuery,
        },
        heroImage: form.heroImage || undefined,
        gallery: [],
        schedule: [],
        wishes: [],
        theme: {
          primaryColor: "#c89b3c",
          secondaryColor: "#e88c9b",
          backgroundColor: "#fffdf8",
          fontHeading: "Playfair Display",
          fontBody: "Manrope",
        },
      })
      router.push(`/admin/events/${eventId}/edit`)
    } catch (err: any) {
      setError(err.message || "Failed to create event")
      setSaving(false)
    }
  }

  return (
    <Shell>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-md hover:bg-gold/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gold-light" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-gold-light">Create Event</h1>
          <p className="text-gold-light/50 text-sm mt-0.5">Set up a new event page</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gold-light mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Event Name *</label>
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
                placeholder="auto-generated-from-name"
                className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors placeholder:text-gold-light/30"
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
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="e.g. The Beginning of Forever"
                className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors placeholder:text-gold-light/30"
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

        {/* Schedule */}
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

        {/* Venue */}
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

        {/* Hero Image */}
        <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gold-light mb-4">Hero Image</h2>
          <ImageUploader
            label="Upload Hero Image (optional)"
            value={form.heroImage}
            onUpload={(url) => updateField("heroImage", url)}
            folder="palei-events/events/hero"
            aspectRatio={16 / 9}
            targetWidth={1920}
            targetHeight={1080}
            hint="Recommended: 1920×1080px (16:9). You can also set this later in the edit view."
          />
          {form.heroImage && (
            <p className="mt-2 text-[10px] text-gold-light/30 font-mono truncate">{form.heroImage}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Event
              </>
            )}
          </button>
          <a
            href="/admin/events"
            className="px-4 py-2.5 text-sm text-gold-light/60 hover:text-gold-light transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </Shell>
  )
}
