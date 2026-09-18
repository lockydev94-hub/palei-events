"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext"
import { PageHeader, Card } from "@/components/customer/DashboardShell"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { createMyEvent } from "@/lib/customer"
import { getTemplates } from "@/lib/firestore"
import type { Template } from "@/lib/firestore"
import { eventTypeMeta, type EventType } from "@/data/events"

const EVENT_TYPES = Object.entries(eventTypeMeta).map(([key, meta]) => ({
  key,
  label: meta.label,
}))

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60)
}

export default function NewEventPage() {
  const { user } = useCustomerAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [type, setType] = useState<EventType>("wedding")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [venueName, setVenueName] = useState("")
  const [venueCity, setVenueCity] = useState("")
  const [description, setDescription] = useState("")
  const [heroImage, setHeroImage] = useState("")
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTemplates().then((t) => setTemplates(t))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError(null)
    try {
      const id = await createMyEvent(user.uid, {
        name: name.trim(),
        slug: slugify(name) || `event-${Date.now()}`,
        type: type as EventType,
        tagline:
          description.slice(0, 90) ||
          `${eventTypeMeta[type]?.label ?? "Special"} celebration`,
        description: description.trim(),
        startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
        ...(endDate ? { endDate: new Date(endDate).toISOString() } : {}),
        theme: {
          primaryColor: "#c89b3c",
          secondaryColor: "#172033",
          backgroundColor: "#fffdf8",
          fontHeading: "Playfair Display",
          fontBody: "Manrope",
        },
        venue: venueName
          ? { name: venueName, address: "", city: venueCity, mapQuery: `${venueName} ${venueCity}` }
          : undefined,
        heroImage: heroImage || undefined,
        gallery: [],
        schedule: [],
        wishes: [],
      })
      router.push(`/dashboard/events/${id}`)
    } catch (err) {
      console.error("[customer] create event failed:", err)
      setError("Could not create the event. Please try again.")
      setSaving(false)
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
    <div>
      <PageHeader
        title="Create a new event"
        subtitle="Five quick details now — you can edit everything else later."
      />

      <form onSubmit={handleSubmit} className="grid gap-6">
        <Card className="p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="ev-name" className={labelCls}>Event name *</label>
              <input
                id="ev-name"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav & Ananya's Wedding"
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Event type *</label>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map(({ key, label }) => (
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
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="ev-start" className={labelCls}>Start date & time *</label>
              <input
                id="ev-start"
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="ev-end" className={labelCls}>End date <span className="font-normal text-mutedText">(optional)</span></label>
              <input
                id="ev-end"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="ev-venue" className={labelCls}>Venue name</label>
              <input
                id="ev-venue"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="Grand Palace Banquet"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="ev-city" className={labelCls}>City</label>
              <input
                id="ev-city"
                value={venueCity}
                onChange={(e) => setVenueCity(e.target.value)}
                placeholder="Bhubaneswar"
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ev-desc" className={labelCls}>Description</label>
              <textarea
                id="ev-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your guests what this celebration is about…"
                className={`${inputCls} resize-none`}
                style={inputStyle}
              />
            </div>
          </div>
        </Card>

        {/* Template picker */}
        {templates.length > 0 && (
          <Card className="p-6 sm:p-8">
            <label className={labelCls}>Start from a template <span className="font-normal text-mutedText">(optional)</span></label>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <button
                type="button"
                onClick={() => setTemplateId(null)}
                className="rounded-xl p-4 text-left text-[0.8rem] font-medium transition-all"
                style={
                  templateId === null
                    ? { border: "1.5px solid rgba(200,155,60,0.55)", background: "rgba(200,155,60,0.08)", color: "#a67f2e" }
                    : { border: "1px solid rgba(23,32,51,0.12)", color: "#374151" }
                }
              >
                Start blank
              </button>
              {templates.slice(0, 7).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  className="rounded-xl p-4 text-left transition-all"
                  style={
                    templateId === t.id
                      ? { border: "1.5px solid rgba(200,155,60,0.55)", background: "rgba(200,155,60,0.08)" }
                      : { border: "1px solid rgba(23,32,51,0.12)" }
                  }
                >
                  <p className="text-[0.82rem] font-semibold text-navy">{t.name}</p>
                  <p className="mt-0.5 text-[0.7rem] text-mutedText">{t.style}</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Hero image */}
        <Card className="p-6 sm:p-8">
          <label className={labelCls}>Hero image <span className="font-normal text-mutedText">(optional — you can add more later)</span></label>
          <ImageUploader
            value={heroImage}
            onUpload={(url) => setHeroImage(url)}
            label="Event hero"
            folder="events/hero"
            aspectRatio={16 / 9}
            targetWidth={1920}
          />
        </Card>

        {error && (
          <p
            className="rounded-xl px-4 py-3 text-[0.85rem]"
            style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c" }}
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl px-6 py-3 text-[0.85rem] font-semibold text-mutedText transition-colors hover:text-navy"
          >
            Cancel
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
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Creating…" : "Create event (draft)"}
          </button>
        </div>
      </form>
    </div>
  )
}
