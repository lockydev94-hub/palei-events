"use client"

import { useState, useEffect } from "react"
import Shell from "@/components/admin/Shell"
import {
  getBlogPosts,
  getFeatures,
  getPricingPlans,
  getSolutions,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  updateFeatures,
  updateSolutions,
  type FirestoreBlogPost,
  type Feature,
  type PricingPlan,
  type Solution,
} from "@/lib/firestore"
import { useAuth } from "@/components/admin/auth/AuthContext"
import { ImageUploader } from "@/components/admin/ImageUploader"
import {
  FileText,
  Star,
  CreditCard,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  X,
  Save,
} from "lucide-react"

type Tab = "blog" | "features" | "pricing" | "solutions"

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>("blog")
  const [blogPosts, setBlogPosts] = useState<FirestoreBlogPost[]>([])
  const [featuresList, setFeaturesList] = useState<Feature[]>([])
  const [pricingList, setPricingList] = useState<PricingPlan[]>([])
  const [solutionsList, setSolutionsList] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Modal state — null = no modal, "blog"/"pricing" = which modal is open.
  const [modal, setModal] = useState<
    | { kind: "blog"; post: Partial<FirestoreBlogPost>; id?: string }
    | { kind: "pricing"; plan: Partial<PricingPlan>; id?: string }
    | null
  >(null)

  useEffect(() => {
    async function load() {
      try {
        const [blogs, feats, pricing, sols] = await Promise.all([
          getBlogPosts("admin"),
          getFeatures("admin"),
          getPricingPlans("admin"),
          getSolutions("admin"),
        ])
        setBlogPosts(blogs)
        setFeaturesList(feats)
        setPricingList(pricing)
        setSolutionsList(sols)
      } catch (err) {
        console.error("Content load error:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "blog", label: "Blog Posts", icon: <FileText className="h-4 w-4" /> },
    { key: "features", label: "Features", icon: <Star className="h-4 w-4" /> },
    { key: "pricing", label: "Pricing", icon: <CreditCard className="h-4 w-4" /> },
    { key: "solutions", label: "Solutions", icon: <Sparkles className="h-4 w-4" /> },
  ]

  // ── Blog ──────────────────────────────────────────────────────
  async function handleDeleteBlog(id: string) {
    if (!confirm("Delete this blog post? This is permanent.")) return
    try {
      await deleteBlogPost(id, { actor: user ? { uid: user.uid, email: user.email } : undefined, ctx: "admin" })
      setBlogPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Failed to delete blog post:", err)
    }
  }

  function openNewBlog() {
    setModal({
      kind: "blog",
      post: {
        title: "",
        slug: "",
        excerpt: "",
        category: "Wedding",
        date: new Date().toISOString().slice(0, 10),
        readTime: "5 min read",
        image: "",
        status: "draft",
      },
    })
  }

  function openEditBlog(post: FirestoreBlogPost) {
    setModal({ kind: "blog", post: { ...post }, id: post.id })
  }

  async function saveBlog() {
    if (!modal || modal.kind !== "blog") return
    setSaving(true)
    setError(null)
    try {
      const actor = user ? { uid: user.uid, email: user.email } : undefined
      if (modal.id) {
        await updateBlogPost(modal.id, modal.post, { actor, ctx: "admin" })
        setBlogPosts((prev) =>
          prev.map((p) => (p.id === modal.id ? { ...p, ...(modal.post as FirestoreBlogPost) } : p))
        )
      } else {
        const id = await createBlogPost(modal.post, { actor, ctx: "admin" })
        setBlogPosts((prev) => [...prev, { ...(modal.post as FirestoreBlogPost), id }])
      }
      setModal(null)
    } catch (err: any) {
      setError(err.message || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  // ── Pricing ───────────────────────────────────────────────────
  async function handleDeletePricing(id: string) {
    if (!confirm("Delete this pricing plan?")) return
    try {
      await deletePricingPlan(id, { actor: user ? { uid: user.uid, email: user.email } : undefined, ctx: "admin" })
      setPricingList((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Failed to delete pricing plan:", err)
    }
  }

  function openNewPricing() {
    setModal({
      kind: "pricing",
      plan: {
        id: "",
        name: "",
        price: "",
        description: "",
        features: [],
        cta: "Get started",
        featured: false,
      },
    })
  }

  function openEditPricing(plan: PricingPlan) {
    setModal({ kind: "pricing", plan: { ...plan }, id: plan.id })
  }

  async function savePricing() {
    if (!modal || modal.kind !== "pricing") return
    setSaving(true)
    setError(null)
    try {
      const actor = user ? { uid: user.uid, email: user.email } : undefined
      if (modal.id) {
        await updatePricingPlan(modal.id, modal.plan, { actor, ctx: "admin" })
        setPricingList((prev) =>
          prev.map((p) => (p.id === modal.id ? { ...p, ...(modal.plan as PricingPlan) } : p))
        )
      } else {
        const id = await createPricingPlan(modal.plan, { actor, ctx: "admin" })
        setPricingList((prev) => [...prev, { ...(modal.plan as PricingPlan), id }])
      }
      setModal(null)
    } catch (err: any) {
      setError(err.message || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  // ── Features ──────────────────────────────────────────────────
  async function saveFeatures() {
    setSaving(true)
    setError(null)
    try {
      await updateFeatures(featuresList, {
        actor: user ? { uid: user.uid, email: user.email } : undefined,
      ctx: "admin",
      })
    } catch (err: any) {
      setError(err.message || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  // ── Solutions ─────────────────────────────────────────────────
  async function saveSolutions() {
    setSaving(true)
    setError(null)
    try {
      await updateSolutions(solutionsList, {
        actor: user ? { uid: user.uid, email: user.email } : undefined,
      ctx: "admin",
      })
    } catch (err: any) {
      setError(err.message || "Save failed")
    } finally {
      setSaving(false)
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

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gold-light">Content</h1>
        <p className="text-gold-light/50 text-sm mt-1">
          Manage blog, features, pricing, and solutions content
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-navy/60 border border-white/5 rounded-lg p-1 mb-6 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-gold/15 text-gold"
                : "text-gold-light/50 hover:text-gold-light hover:bg-white/5"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Blog Tab */}
      {tab === "blog" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gold-light/50 text-sm">{blogPosts.length} posts</p>
            <button
              onClick={openNewBlog}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Post
            </button>
          </div>
          <div className="bg-navy/60 border border-white/5 rounded-xl divide-y divide-white/5">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gold-light truncate">{post.title}</p>
                  <p className="text-xs text-gold-light/40 mt-0.5">
                    {post.category} • {post.date} • {post.readTime}
                    {post.status && (
                      <>
                        {" • "}
                        <span
                          className={
                            post.status === "published" ? "text-emerald-400" : "text-amber-400"
                          }
                        >
                          {post.status}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md hover:bg-gold/10 text-gold-light/50 hover:text-gold-light transition-colors"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => openEditBlog(post)}
                    className="p-2 rounded-md hover:bg-gold/10 text-gold-light/50 hover:text-gold-light transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(post.id)}
                    className="p-2 rounded-md hover:bg-red-500/10 text-gold-light/50 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {blogPosts.length === 0 && (
              <p className="p-8 text-center text-gold-light/40 text-sm">No posts yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Features Tab */}
      {tab === "features" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gold-light/50 text-sm">{featuresList.length} features</p>
            <button
              onClick={saveFeatures}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuresList.map((feature, i) => (
              <div
                key={feature.id}
                className="bg-navy/60 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => {
                      const updated = [...featuresList]
                      updated[i] = { ...feature, title: e.target.value }
                      setFeaturesList(updated)
                    }}
                    className="bg-transparent text-sm font-semibold text-gold-light outline-none w-full"
                  />
                  <select
                    value={feature.category}
                    onChange={(e) => {
                      const updated = [...featuresList]
                      updated[i] = { ...feature, category: e.target.value }
                      setFeaturesList(updated)
                    }}
                    className="bg-navy-dark border border-white/10 rounded px-2 py-0.5 text-[10px] font-medium text-gold-light/80 outline-none focus:border-gold/50 capitalize"
                  >
                    <option>Event Creation</option>
                    <option>Guest Experience</option>
                    <option>Insights &amp; Brand</option>
                    <option>RSVP</option>
                    <option>QR</option>
                    <option>Gallery</option>
                    <option>Guest Upload</option>
                    <option>Schedule</option>
                    <option>Notifications</option>
                    <option>Analytics</option>
                    <option>Custom Branding</option>
                    <option>AI Features</option>
                  </select>
                </div>
                <textarea
                  value={feature.description}
                  onChange={(e) => {
                    const updated = [...featuresList]
                    updated[i] = { ...feature, description: e.target.value }
                    setFeaturesList(updated)
                  }}
                  rows={2}
                  className="bg-transparent text-xs text-gold-light/50 outline-none w-full mt-2 resize-none"
                />
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                  <label className="text-[10px] text-gold-light/40 uppercase tracking-wider flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={!!feature.comingSoon}
                      onChange={(e) => {
                        const updated = [...featuresList]
                        updated[i] = { ...feature, comingSoon: e.target.checked }
                        setFeaturesList(updated)
                      }}
                      className="rounded"
                    />
                    Coming soon
                  </label>
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => {
                      const updated = [...featuresList]
                      updated[i] = { ...feature, icon: e.target.value }
                      setFeaturesList(updated)
                    }}
                    placeholder="icon key (globe, qr, …)"
                    className="flex-1 bg-navy-dark border border-white/10 rounded px-2 py-1 text-[10px] text-gold-light/60 outline-none focus:border-gold/50 font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {tab === "pricing" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gold-light/50 text-sm">{pricingList.length} plans</p>
            <button
              onClick={openNewPricing}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Plan
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingList.map((plan) => (
              <div
                key={plan.id}
                className={`bg-navy/60 border rounded-xl p-6 hover:border-gold/20 transition-colors ${
                  plan.featured ? "border-gold/30" : "border-white/5"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {plan.featured && (
                      <span className="inline-block px-2 py-0.5 bg-gold/15 text-gold text-[10px] font-semibold rounded-full mb-2">
                        Featured
                      </span>
                    )}
                    <h3 className="text-lg font-display font-semibold text-gold-light">
                      {plan.name}
                    </h3>
                    <div className="mt-1 mb-3">
                      <span className="text-2xl font-display font-bold text-gold">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-xs text-gold-light/40 ml-1">/ {plan.period}</span>
                      )}
                    </div>
                    <p className="text-xs text-gold-light/50 mb-3 line-clamp-2">
                      {plan.description}
                    </p>
                    <p className="text-[10px] text-gold-light/30">
                      {plan.features.length} features
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <button
                      onClick={() => openEditPricing(plan)}
                      className="p-1.5 rounded-md hover:bg-gold/10 text-gold-light/50 hover:text-gold-light transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePricing(plan.id)}
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-gold-light/50 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pricingList.length === 0 && (
              <p className="col-span-full p-8 text-center text-gold-light/40 text-sm">
                No plans yet — add one to get started.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Solutions Tab */}
      {tab === "solutions" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gold-light/50 text-sm">
              {solutionsList.length} solutions
              <span className="text-gold-light/30 ml-2">— stored in solutions/current</span>
            </p>
            <button
              onClick={saveSolutions}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
          <div className="space-y-4">
            {solutionsList.map((sol, i) => (
              <div
                key={sol.id || i}
                className="bg-navy/60 border border-white/5 rounded-xl p-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                      Audience
                    </label>
                    <input
                      type="text"
                      value={sol.audience}
                      onChange={(e) => {
                        const updated = [...solutionsList]
                        updated[i] = { ...sol, audience: e.target.value }
                        setSolutionsList(updated)
                      }}
                      className="w-full bg-navy-dark border border-white/10 rounded px-3 py-1.5 text-sm text-gold-light outline-none focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={sol.title}
                      onChange={(e) => {
                        const updated = [...solutionsList]
                        updated[i] = { ...sol, title: e.target.value }
                        setSolutionsList(updated)
                      }}
                      className="w-full bg-navy-dark border border-white/10 rounded px-3 py-1.5 text-sm text-gold-light outline-none focus:border-gold/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      value={sol.description}
                      onChange={(e) => {
                        const updated = [...solutionsList]
                        updated[i] = { ...sol, description: e.target.value }
                        setSolutionsList(updated)
                      }}
                      rows={2}
                      className="w-full bg-navy-dark border border-white/10 rounded px-3 py-1.5 text-sm text-gold-light outline-none focus:border-gold/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                      Icon key
                    </label>
                    <input
                      type="text"
                      value={sol.icon}
                      onChange={(e) => {
                        const updated = [...solutionsList]
                        updated[i] = { ...sol, icon: e.target.value }
                        setSolutionsList(updated)
                      }}
                      className="w-full bg-navy-dark border border-white/10 rounded px-3 py-1.5 text-sm text-gold-light/80 outline-none focus:border-gold/50 font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                      Image
                    </label>
                    <ImageUploader
                      value={sol.image}
                      onUpload={(url) => {
                        const updated = [...solutionsList]
                        updated[i] = { ...sol, image: url }
                        setSolutionsList(updated)
                      }}
                      folder="palei-events/solutions"
                      aspectRatio={4 / 3}
                      targetWidth={800}
                      targetHeight={600}
                      hint="Solution illustration (800×600px, 4:3)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => !saving && setModal(null)}
        >
          <div
            className="bg-navy-dark border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-gold-light">
                {modal.kind === "blog"
                  ? modal.id
                    ? "Edit Blog Post"
                    : "New Blog Post"
                  : modal.id
                  ? "Edit Pricing Plan"
                  : "New Pricing Plan"}
              </h2>
              <button
                onClick={() => setModal(null)}
                disabled={saving}
                className="p-1.5 rounded-md hover:bg-white/5 text-gold-light/50 hover:text-gold-light"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {modal.kind === "blog" && (
              <div className="space-y-3">
                <Field label="Title">
                  <input
                    type="text"
                    value={modal.post.title ?? ""}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        post: { ...modal.post, title: e.target.value },
                      })
                    }
                    className="admin-input"
                  />
                </Field>
                <Field label="Slug">
                  <input
                    type="text"
                    value={modal.post.slug ?? ""}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        post: { ...modal.post, slug: e.target.value },
                      })
                    }
                    className="admin-input"
                  />
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Category">
                    <input
                      type="text"
                      value={modal.post.category ?? ""}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          post: { ...modal.post, category: e.target.value },
                        })
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Date">
                    <input
                      type="date"
                      value={modal.post.date ?? ""}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          post: { ...modal.post, date: e.target.value },
                        })
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Read time">
                    <input
                      type="text"
                      value={modal.post.readTime ?? ""}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          post: { ...modal.post, readTime: e.target.value },
                        })
                      }
                      className="admin-input"
                    />
                  </Field>
                </div>
                <Field label="Excerpt">
                  <textarea
                    rows={2}
                    value={modal.post.excerpt ?? ""}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        post: { ...modal.post, excerpt: e.target.value },
                      })
                    }
                    className="admin-input resize-none"
                  />
                </Field>
                <Field label="Hero image">
                  <ImageUploader
                    value={modal.post.image ?? ""}
                    onUpload={(url) =>
                      setModal({
                        ...modal,
                        post: { ...modal.post, image: url },
                      })
                    }
                    folder="palei-events/blog"
                    aspectRatio={16 / 9}
                    targetWidth={1200}
                    targetHeight={675}
                    hint="Recommended: 1200×675px (16:9) for blog post hero."
                  />
                  {modal.post.image && (
                    <p className="mt-1 text-[10px] text-gold-light/30 font-mono truncate">{modal.post.image}</p>
                  )}
                </Field>
                <Field label="Status">
                  <select
                    value={modal.post.status ?? "draft"}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        post: { ...modal.post, status: e.target.value as any },
                      })
                    }
                    className="admin-input appearance-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>
              </div>
            )}

            {modal.kind === "pricing" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Plan ID (slug)" required>
                    <input
                      type="text"
                      value={modal.plan.id ?? ""}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          plan: {
                            ...modal.plan,
                            id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                          },
                        })
                      }
                      className="admin-input font-mono"
                      disabled={!!modal.id}
                    />
                  </Field>
                  <Field label="Name" required>
                    <input
                      type="text"
                      value={modal.plan.name ?? ""}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          plan: { ...modal.plan, name: e.target.value },
                        })
                      }
                      className="admin-input"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price">
                    <input
                      type="text"
                      value={modal.plan.price ?? ""}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          plan: { ...modal.plan, price: e.target.value },
                        })
                      }
                      placeholder="₹2,999"
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Period">
                    <select
                      value={modal.plan.period ?? ""}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          plan: { ...modal.plan, period: e.target.value as any },
                        })
                      }
                      className="admin-input appearance-none"
                    >
                      <option value="">—</option>
                      <option value="forever">forever</option>
                      <option value="per event">per event</option>
                      <option value="per month">per month</option>
                    </select>
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    rows={2}
                    value={modal.plan.description ?? ""}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        plan: { ...modal.plan, description: e.target.value },
                      })
                    }
                    className="admin-input resize-none"
                  />
                </Field>
                <Field label="Features (one per line)">
                  <textarea
                    rows={5}
                    value={(modal.plan.features ?? []).join("\n")}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        plan: {
                          ...modal.plan,
                          features: e.target.value.split("\n").filter((s) => s.trim()),
                        },
                      })
                    }
                    className="admin-input resize-none font-mono text-xs"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="CTA button text">
                    <input
                      type="text"
                      value={modal.plan.cta ?? ""}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          plan: { ...modal.plan, cta: e.target.value },
                        })
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Featured?">
                    <label className="flex items-center gap-2 h-10 text-sm text-gold-light/70">
                      <input
                        type="checkbox"
                        checked={!!modal.plan.featured}
                        onChange={(e) =>
                          setModal({
                            ...modal,
                            plan: { ...modal.plan, featured: e.target.checked },
                          })
                        }
                        className="rounded"
                      />
                      Highlight as Most Popular
                    </label>
                  </Field>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setModal(null)}
                disabled={saving}
                className="px-4 py-2 text-sm text-gold-light/60 hover:text-gold-light"
              >
                Cancel
              </button>
              <button
                onClick={modal.kind === "blog" ? saveBlog : savePricing}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-5 py-2 text-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.admin-input) {
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
        :global(.admin-input:focus) {
          border-color: rgba(200, 155, 60, 0.5);
        }
      `}</style>
    </Shell>
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
