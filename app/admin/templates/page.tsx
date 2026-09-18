"use client"

import { useState, useEffect } from "react"
import Shell from "@/components/admin/Shell"
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/lib/firestore"
import { templates as fallbackTemplates } from "@/data/templates"
import type { Template } from "@/data/templates"
import { useAuth } from "@/components/admin/auth/AuthContext"
import { ImageUploader } from "@/components/admin/ImageUploader"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  LayoutGrid,
  Star,
  Loader2,
  X,
  Save,
} from "lucide-react"

const TEMPLATE_CATEGORIES = [
  "wedding",
  "birthday",
  "corporate",
  "school",
  "college",
  "government",
  "cultural",
  "sports",
] as const

export default function TemplatesPage() {
  const [templatesList, setTemplatesList] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    setLoading(true)
    try {
      const data = await getTemplates()
      setTemplatesList(data)
    } catch {
      setTemplatesList(fallbackTemplates)
    } finally {
      setLoading(false)
    }
  }

  const filtered = templatesList.filter((t) => {
    const q = searchQuery.trim().toLowerCase()
    const matchesQ =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.style.toLowerCase().includes(q)
    const matchesCat = filterCategory === "all" || t.category === filterCategory
    return matchesQ && matchesCat
  })

  async function handleSaveTemplate() {
    if (!editingTemplate) return
    setSaving(true)
    setError(null)
    try {
      await updateTemplate(editingTemplate.id, editingTemplate, {
        actor: user ? { uid: user.uid, email: user.email } : undefined,
      })
      setTemplatesList((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t))
      )
      setEditingTemplate(null)
    } catch (err: any) {
      setError(err.message || "Failed to save template")
    } finally {
      setSaving(false)
    }
  }

  async function handleCreateTemplate() {
    setSaving(true)
    setError(null)
    try {
      const id = await createTemplate(editingTemplate!, {
        actor: user ? { uid: user.uid, email: user.email } : undefined,
      })
      setTemplatesList((prev) => [...prev, { ...(editingTemplate as Template), id }])
      setEditingTemplate(null)
      setCreating(false)
    } catch (err: any) {
      setError(err.message || "Failed to create template")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteTemplate(id: string) {
    if (!confirm("Delete this template? Permanent but recorded in the audit log.")) return
    try {
      await deleteTemplate(id, {
        actor: user ? { uid: user.uid, email: user.email } : undefined,
      })
      setTemplatesList((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error("Failed to delete template:", err)
    }
  }

  function openNewTemplate() {
    setCreating(true)
    setEditingTemplate({
      id: "",
      name: "",
      category: "wedding",
      style: "",
      description: "",
      preview: "",
      featured: false,
    })
  }

  return (
    <Shell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gold-light">Templates</h1>
          <p className="text-gold-light/50 text-sm mt-1">{templatesList.length} templates in library</p>
        </div>
        <button
          onClick={openNewTemplate}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Template
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-light/40" />
          <input
            type="text"
            placeholder="Search templates…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors placeholder:text-gold-light/30"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-navy/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {TEMPLATE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <LayoutGrid className="h-12 w-12 text-gold-light/20 mx-auto mb-3" />
          <p className="text-gold-light/50 text-sm">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="bg-navy/60 border border-white/5 rounded-xl overflow-hidden hover:border-gold/20 transition-colors group"
            >
              {/* Preview */}
              <div className="h-40 bg-navy-dark overflow-hidden relative">
                {template.preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {template.featured && (
                  <div className="absolute top-2 right-2 bg-gold/90 text-navy-dark px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gold-light">{template.name}</h3>
                    <p className="text-xs text-gold-light/40 mt-0.5">{template.style}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-medium rounded-full capitalize">
                    {template.category}
                  </span>
                </div>
                <p className="text-xs text-gold-light/50 mt-2 line-clamp-2">{template.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      setCreating(false)
                      setEditingTemplate(template)
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-medium rounded-md transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  {template.demoSlug && (
                    <a
                      href={`/e/${template.demoSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-white/10 hover:bg-white/5 text-gold-light/60 text-xs font-medium rounded-md transition-colors"
                    >
                      Preview
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-1.5 rounded-md hover:bg-red-500/10 text-gold-light/40 hover:text-red-400 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingTemplate && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !saving && (setEditingTemplate(null), setCreating(false))}
        >
          <div
            className="bg-navy border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-semibold text-gold-light">
                {creating ? "New Template" : "Edit Template"}
              </h3>
              <button
                onClick={() => {
                  setEditingTemplate(null)
                  setCreating(false)
                }}
                disabled={saving}
                className="p-1.5 rounded-md hover:bg-gold/10 transition-colors"
              >
                <X className="h-5 w-5 text-gold-light/60" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                  className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Description</label>
                <textarea
                  value={editingTemplate.description}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Category</label>
                  <select
                    value={editingTemplate.category}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, category: e.target.value as any })
                    }
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 appearance-none"
                  >
                    {TEMPLATE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Style</label>
                  <input
                    type="text"
                    value={editingTemplate.style}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, style: e.target.value })
                    }
                    placeholder="Classic · Gold"
                    className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50"
                  />
                </div>
              </div>
              <div>
                <ImageUploader
                  label="Preview image"
                  value={editingTemplate.preview}
                  onUpload={(url) =>
                    setEditingTemplate({ ...editingTemplate, preview: url })
                  }
                  folder="palei-events/templates"
                  aspectRatio={4 / 3}
                  targetWidth={800}
                  targetHeight={600}
                  hint="Template preview thumbnail (800×600px, 4:3)"
                />
                {editingTemplate.preview && (
                  <p className="mt-1 text-[10px] text-gold-light/30 font-mono truncate">{editingTemplate.preview}</p>
                )}
              </div>
              <div>
                <label className="block text-gold-light/60 text-xs font-medium mb-1.5">Demo slug (optional)</label>
                <input
                  type="text"
                  value={editingTemplate.demoSlug || ""}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, demoSlug: e.target.value })
                  }
                  placeholder="aarav-ananya-wedding"
                  className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 font-mono"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingTemplate.featured || false}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, featured: e.target.checked })
                  }
                  className="rounded border-white/20"
                />
                <span className="text-sm text-gold-light/70">Featured (show at top of Step 2)</span>
              </label>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={creating ? handleCreateTemplate : handleSaveTemplate}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {creating ? "Create" : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditingTemplate(null)
                  setCreating(false)
                }}
                disabled={saving}
                className="px-4 py-2 text-sm text-gold-light/60 hover:text-gold-light transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}
