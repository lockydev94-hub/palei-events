"use client"

import { useState, useEffect } from "react"
import Shell from "@/components/admin/Shell"
import {
  getActiveAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  type Announcement,
  type Campaign,
} from "@/lib/firestore"
import { useAuth } from "@/components/admin/auth/AuthContext"
import {
  Megaphone,
  Tag,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react"

type Tab = "announcements" | "campaigns" | "seo"

const PLAN_KEYS = ["free", "celebration", "premium", "business", "enterprise"] as const
const ROLE_KEYS = ["admin", "editor", "viewer"] as const

export default function MarketingPage() {
  const [tab, setTab] = useState<Tab>("announcements")
  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gold-light">Marketing</h1>
        <p className="text-gold-light/50 text-sm mt-1">
          Announcements, campaigns, and SEO
        </p>
      </div>

      <div className="flex gap-1 bg-navy/60 border border-white/5 rounded-lg p-1 mb-6 w-fit">
        <TabButton active={tab === "announcements"} onClick={() => setTab("announcements")} icon={Megaphone}>
          Announcements
        </TabButton>
        <TabButton active={tab === "campaigns"} onClick={() => setTab("campaigns")} icon={Tag}>
          Campaigns
        </TabButton>
        <TabButton active={tab === "seo"} onClick={() => setTab("seo")} icon={Search}>
          SEO
        </TabButton>
      </div>

      {tab === "announcements" && <AnnouncementsPanel />}
      {tab === "campaigns" && <CampaignsPanel />}
      {tab === "seo" && <SeoPanel />}
    </Shell>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-gold/15 text-gold"
          : "text-gold-light/50 hover:text-gold-light hover:bg-white/5"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  )
}

// ── Announcements ──────────────────────────────────────────────
function AnnouncementsPanel() {
  const [list, setList] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Announcement> | null>(null)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      setList(await getActiveAnnouncements())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      const actor = user ? { uid: user.uid, email: user.email } : undefined
      if (editing.id) {
        await updateAnnouncement(editing.id, editing, { actor })
      } else {
        const id = await createAnnouncement(editing, { actor })
        setList((prev) => [...prev, { ...(editing as Announcement), id }])
        setEditing(null)
        await load()
        return
      }
      setList((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...editing } : a)))
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  async function remove(a: Announcement) {
    if (!confirm(`Delete announcement "${a.title}"?`)) return
    await deleteAnnouncement(a.id, {
      actor: user ? { uid: user.uid, email: user.email } : undefined,
    })
    setList((prev) => prev.filter((x) => x.id !== a.id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gold-light/50 text-sm">{list.length} active</p>
        <button
          onClick={() =>
            setEditing({
              title: "",
              body: "",
              type: "info",
              startsAt: new Date().toISOString().slice(0, 10),
            })
          }
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      </div>

      <div className="bg-navy/60 border border-white/5 rounded-xl divide-y divide-white/5">
        {loading ? (
          <div className="p-8 text-center text-gold-light/40 text-sm">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-gold" />
            Loading…
          </div>
        ) : list.length === 0 ? (
          <p className="p-8 text-center text-gold-light/40 text-sm">No active announcements.</p>
        ) : (
          list.map((a) => (
            <div key={a.id} className="px-6 py-4 flex items-center gap-3">
              <AnnouncementIcon type={a.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gold-light font-medium truncate">{a.title}</p>
                <p className="text-xs text-gold-light/40 mt-0.5">
                  {a.startsAt?.slice(0, 10)}
                  {a.endsAt ? ` → ${a.endsAt.slice(0, 10)}` : " · no end"}
                </p>
              </div>
              <button
                onClick={() => setEditing(a)}
                className="p-1.5 rounded-md hover:bg-gold/10 text-gold-light/60 hover:text-gold-light"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => remove(a)}
                className="p-1.5 rounded-md hover:bg-red-500/10 text-gold-light/60 hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit Announcement" : "New Announcement"} onClose={() => setEditing(null)}>
          <div className="space-y-3">
            <Field label="Title">
              <input
                value={editing.title || ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Body (markdown supported)">
              <textarea
                rows={3}
                value={editing.body || ""}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                className="admin-input resize-none"
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Type">
                <select
                  value={editing.type}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value as any })}
                  className="admin-input appearance-none"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </Field>
              <Field label="Starts">
                <input
                  type="date"
                  value={editing.startsAt?.slice(0, 10) || ""}
                  onChange={(e) => setEditing({ ...editing, startsAt: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Ends (optional)">
                <input
                  type="date"
                  value={editing.endsAt?.slice(0, 10) || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, endsAt: e.target.value || undefined })
                  }
                  className="admin-input"
                />
              </Field>
            </div>
            <Field label="Show to plans">
              <div className="flex flex-wrap gap-2 mt-1">
                {PLAN_KEYS.map((p) => {
                  const active = (editing.plans ?? []).includes(p)
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        const current = new Set(editing.plans ?? [])
                        if (active) current.delete(p)
                        else current.add(p)
                        setEditing({
                          ...editing,
                          plans: current.size === 0 ? undefined : Array.from(current),
                        })
                      }}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        active
                          ? "border-gold/40 bg-gold/15 text-gold"
                          : "border-white/10 text-gold-light/50 hover:text-gold-light"
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
              <p className="text-[10px] text-gold-light/40 mt-1">
                Leave empty to show to everyone.
              </p>
            </Field>
          </div>
          <ModalActions
            onCancel={() => setEditing(null)}
            onSave={save}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  )
}

function AnnouncementIcon({ type }: { type?: Announcement["type"] }) {
  if (type === "success") return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
  if (type === "warning") return <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
  if (type === "error") return <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
  return <Info className="h-5 w-5 text-gold shrink-0" />
}

// ── Campaigns ───────────────────────────────────────────────────
function CampaignsPanel() {
  const [list, setList] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Campaign> | null>(null)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      setList(await getCampaigns())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      const actor = user ? { uid: user.uid, email: user.email } : undefined
      if (editing.id) {
        await updateCampaign(editing.id, editing, { actor })
        setList((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...editing } : c)))
      } else {
        const id = await createCampaign(editing, { actor })
        setList((prev) => [...prev, { ...(editing as Campaign), id }])
      }
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  async function remove(c: Campaign) {
    if (!confirm(`Delete campaign "${c.code}"?`)) return
    await deleteCampaign(c.id, {
      actor: user ? { uid: user.uid, email: user.email } : undefined,
    })
    setList((prev) => prev.filter((x) => x.id !== c.id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gold-light/50 text-sm">{list.length} campaigns</p>
        <button
          onClick={() =>
            setEditing({
              code: "",
              discountPercent: 20,
              maxUses: undefined,
              usesCount: 0,
              applicableTo: [],
              startsAt: new Date().toISOString().slice(0, 10),
            })
          }
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      <div className="bg-navy/60 border border-white/5 rounded-xl divide-y divide-white/5">
        {loading ? (
          <div className="p-8 text-center text-gold-light/40 text-sm">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-gold" />
            Loading…
          </div>
        ) : list.length === 0 ? (
          <p className="p-8 text-center text-gold-light/40 text-sm">No campaigns yet.</p>
        ) : (
          list.map((c) => (
            <div key={c.id} className="px-6 py-4 flex items-center gap-3">
              <div className="font-mono text-sm text-gold bg-gold/10 px-3 py-1.5 rounded-md">
                {c.code}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gold-light">
                  {c.discountPercent ? `${c.discountPercent}% off` : c.discountAmount}
                  {c.applicableTo.length > 0 && (
                    <span className="text-gold-light/40"> · {c.applicableTo.join(", ")}</span>
                  )}
                </p>
                <p className="text-xs text-gold-light/40 mt-0.5">
                  Used {c.usesCount}
                  {c.maxUses ? ` / ${c.maxUses}` : ""} · starts {c.startsAt?.slice(0, 10)}
                  {c.endsAt ? ` · ends ${c.endsAt.slice(0, 10)}` : ""}
                </p>
              </div>
              <button
                onClick={() => setEditing(c)}
                className="p-1.5 rounded-md hover:bg-gold/10 text-gold-light/60 hover:text-gold-light"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => remove(c)}
                className="p-1.5 rounded-md hover:bg-red-500/10 text-gold-light/60 hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit Campaign" : "New Campaign"} onClose={() => setEditing(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Code (uppercase)" required>
                <input
                  value={editing.code || ""}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                  placeholder="WELCOME20"
                  className="admin-input font-mono uppercase"
                />
              </Field>
              <Field label="Discount %">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editing.discountPercent ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, discountPercent: Number(e.target.value) || undefined })
                  }
                  className="admin-input"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Max uses (blank = unlimited)">
                <input
                  type="number"
                  min={0}
                  value={editing.maxUses ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, maxUses: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="admin-input"
                />
              </Field>
              <Field label="Discount amount (alt to %)">
                <input
                  value={editing.discountAmount ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, discountAmount: e.target.value || undefined })
                  }
                  placeholder="₹500"
                  className="admin-input"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Starts">
                <input
                  type="date"
                  value={editing.startsAt?.slice(0, 10) || ""}
                  onChange={(e) => setEditing({ ...editing, startsAt: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Ends (optional)">
                <input
                  type="date"
                  value={editing.endsAt?.slice(0, 10) || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, endsAt: e.target.value || undefined })
                  }
                  className="admin-input"
                />
              </Field>
            </div>
            <Field label="Applies to plans">
              <div className="flex flex-wrap gap-2 mt-1">
                {PLAN_KEYS.map((p) => {
                  const active = (editing.applicableTo ?? []).includes(p)
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        const current = new Set(editing.applicableTo ?? [])
                        if (active) current.delete(p)
                        else current.add(p)
                        setEditing({ ...editing, applicableTo: Array.from(current) })
                      }}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        active
                          ? "border-gold/40 bg-gold/15 text-gold"
                          : "border-white/10 text-gold-light/50 hover:text-gold-light"
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </Field>
          </div>
          <ModalActions onCancel={() => setEditing(null)} onSave={save} saving={saving} />
        </Modal>
      )}
    </div>
  )
}

// ── SEO ────────────────────────────────────────────────────────
function SeoPanel() {
  return (
    <div className="space-y-4">
      <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gold-light mb-1">SEO defaults</h2>
        <p className="text-xs text-gold-light/40 mb-4">
          Edit defaults in the <a href="/admin/operations" className="text-gold hover:underline">Site Settings</a> page.
        </p>
        <ul className="space-y-2 text-xs text-gold-light/60">
          <li>• Page-specific <code className="font-mono text-gold-light/80">title</code> / <code className="font-mono text-gold-light/80">description</code> overrides live in each route's <code className="font-mono text-gold-light/80">metadata</code> export.</li>
          <li>• Sitemap is generated from <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-gold hover:underline">/sitemap.xml</a>.</li>
          <li>• robots.txt is generated from <a href="/robots.txt" target="_blank" rel="noreferrer" className="text-gold hover:underline">/robots.txt</a>.</li>
        </ul>
      </div>

      <div className="bg-navy/60 border border-white/5 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gold-light mb-1">Structured data</h2>
        <p className="text-xs text-gold-light/40 mb-3">
          Article and event JSON-LD is generated automatically by the route handlers. Verify with{" "}
          <a
            href="https://search.google.com/test/rich-results"
            target="_blank"
            rel="noreferrer"
            className="text-gold hover:underline"
          >
            Google's Rich Results test
          </a>
          .
        </p>
      </div>
    </div>
  )
}

// ── Shared UI ───────────────────────────────────────────────────
function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-navy-dark border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-gold-light">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/5 text-gold-light/60">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ModalActions({
  onCancel,
  onSave,
  saving,
}: {
  onCancel: () => void
  onSave: () => void
  saving: boolean
}) {
  return (
    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/5">
      <button
        onClick={onCancel}
        disabled={saving}
        className="px-4 py-2 text-sm text-gold-light/60 hover:text-gold-light"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-5 py-2 text-sm disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save
      </button>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

// Shared input style — colocated here so each admin page doesn't need its
// own <style jsx> block. Uses a unique class name to avoid clashing with
// Tailwind utilities.
if (typeof document !== "undefined" && !document.getElementById("admin-input-styles")) {
  const el = document.createElement("style")
  el.id = "admin-input-styles"
  el.textContent = `
    .admin-input {
      width: 100%;
      background-color: rgb(15 21 34);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 13px;
      color: rgb(232 213 168);
      outline: none;
      transition: border-color 200ms;
    }
    .admin-input:focus {
      border-color: rgba(200, 155, 60, 0.5);
    }
  `
  document.head.appendChild(el)
}
