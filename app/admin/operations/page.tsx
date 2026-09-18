"use client"

import { useState, useEffect } from "react"
import Shell from "@/components/admin/Shell"
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore"
import { site } from "@/data/site"
import { useAuth } from "@/components/admin/auth/AuthContext"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { Save, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"

interface SocialLinks {
  twitter?: string
  linkedin?: string
  instagram?: string
}

interface SeoMeta {
  defaultTitle?: string
  defaultDescription?: string
  defaultImage?: string
}

export default function OperationsPage() {
  const [settings, setSettings] = useState<any>(site)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings()
        // Merge the loaded data over the static defaults so blank fields
        // (e.g. when a new social handle hasn't been set) still show.
        setSettings({ ...site, ...(data as object) })
      } catch {
        setSettings(site)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await updateSiteSettings(
        {
          name: settings.name,
          domain: settings.domain,
          tagline: settings.tagline,
          description: settings.description,
          email: settings.email,
          phone: settings.phone,
          location: settings.location,
          address: settings.address,
          social: settings.social || {},
          seo: settings.seo || {},
        },
        { actor: user ? { uid: user.uid, email: user.email } : undefined }
      )
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }))
    setSuccess(false)
  }

  const updateNested = (group: "social" | "seo", key: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [group]: { ...(prev[group] || {}), [key]: value },
    }))
    setSuccess(false)
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

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gold-light">Site Settings</h1>
          <p className="text-gold-light/50 text-sm mt-1">
            General site configuration — stored in <span className="font-mono">projects/current</span>
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </button>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-emerald-400 text-sm">Settings saved — metadata.version bumped.</p>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Brand & contact */}
      <Section title="Brand & Contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Site Name" value={settings.name} onChange={(v) => updateField("name", v)} />
          <Field label="Domain" value={settings.domain} onChange={(v) => updateField("domain", v)} />
          <Field
            label="Tagline"
            value={settings.tagline}
            onChange={(v) => updateField("tagline", v)}
            full
          />
          <Field
            label="Description"
            value={settings.description}
            onChange={(v) => updateField("description", v)}
            multiline
            full
          />
          <Field
            label="Email"
            type="email"
            value={settings.email}
            onChange={(v) => updateField("email", v)}
          />
          <Field label="Phone" value={settings.phone} onChange={(v) => updateField("phone", v)} />
          <Field
            label="Location"
            value={settings.location}
            onChange={(v) => updateField("location", v)}
          />
          <Field
            label="Address"
            value={settings.address}
            onChange={(v) => updateField("address", v)}
            multiline
          />
        </div>
      </Section>

      {/* Social links */}
      <Section
        title="Social Links"
        subtitle="Used in the footer, share dialogs, and contact page."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field
            label="Twitter / X"
            value={settings.social?.twitter || ""}
            onChange={(v) => updateNested("social", "twitter", v)}
            placeholder="https://twitter.com/paleievents"
          />
          <Field
            label="LinkedIn"
            value={settings.social?.linkedin || ""}
            onChange={(v) => updateNested("social", "linkedin", v)}
            placeholder="https://linkedin.com/company/paleievents"
          />
          <Field
            label="Instagram"
            value={settings.social?.instagram || ""}
            onChange={(v) => updateNested("social", "instagram", v)}
            placeholder="https://instagram.com/paleievents"
          />
        </div>
      </Section>

      {/* SEO defaults */}
      <Section
        title="SEO Defaults"
        subtitle="Used when a page doesn't specify its own title / description / image."
      >
        <div className="grid grid-cols-1 gap-5">
          <Field
            label="Default title"
            value={settings.seo?.defaultTitle || ""}
            onChange={(v) => updateNested("seo", "defaultTitle", v)}
            placeholder="Palei Events — Every Event. One Digital Experience."
            full
          />
          <Field
            label="Default description"
            value={settings.seo?.defaultDescription || ""}
            onChange={(v) => updateNested("seo", "defaultDescription", v)}
            multiline
            full
          />
          <div className="md:col-span-2">
            <ImageUploader
              label="Default share image (OG image)"
              value={settings.seo?.defaultImage || ""}
              onUpload={(url) => updateNested("seo", "defaultImage", url)}
              folder="palei-events/og"
              aspectRatio={1200 / 630}
              targetWidth={1200}
              targetHeight={630}
              hint="Recommended: 1200×630px (Open Graph standard). Used as default social share image."
            />
            {settings.seo?.defaultImage && (
              <p className="mt-1 text-[10px] text-gold-light/30 font-mono truncate">{settings.seo.defaultImage}</p>
            )}
          </div>
        </div>
      </Section>
    </Shell>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-navy/60 border border-white/5 rounded-xl p-6 mb-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gold-light">{title}</h2>
        {subtitle && <p className="text-xs text-gold-light/40 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
  full,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  multiline?: boolean
  full?: boolean
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-gold-light/60 text-xs font-medium mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50"
        />
      )}
    </div>
  )
}
