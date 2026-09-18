"use client"

import { useState, useEffect } from "react"
import Shell from "@/components/admin/Shell"
import {
  getSubscriptions,
  getUsers,
  updateSubscription,
  cancelSubscription,
  type Subscription,
  type UserProfile,
} from "@/lib/firestore"
import {
  getPlanRequests,
  approvePlanRequest,
  rejectPlanRequest,
  type PlanRequest,
} from "@/lib/customer"
import { useAuth } from "@/components/admin/auth/AuthContext"
import {
  CreditCard,
  Loader2,
  Search,
  X,
  Save,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Check,
  Ban,
} from "lucide-react"

type Tab = "requests" | "subscriptions" | "overview"

export default function BillingPage() {
  const [tab, setTab] = useState<Tab>("requests")
  const [subs, setSubs] = useState<Subscription[]>([])
  const [requests, setRequests] = useState<PlanRequest[] | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<PlanRequest | null>(null)
  const [adminNote, setAdminNote] = useState("")
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const { user } = useAuth()

  useEffect(() => {
    load()
    getPlanRequests().then(setRequests)
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [s, u] = await Promise.all([getSubscriptions("admin"), getUsers("admin")])
      setSubs(s)
      setUsers(u)
    } catch (err) {
      console.error("Billing load error:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(req: PlanRequest) {
    if (!user) return
    if (!confirm(`Approve the "${req.plan}" plan for ${req.email}?`)) return
    setProcessing(req.id)
    try {
      await approvePlanRequest(req, { uid: user.uid, email: user.email || "" })
      setRequests((rs) => (rs ?? []).map((r) => (r.id === req.id ? { ...r, status: "approved" as const } : r)))
      await load() // subscription list changed
    } catch (err) {
      console.error("Approve failed:", err)
      alert("Could not approve the request — see console for details.")
    } finally {
      setProcessing(null)
    }
  }

  async function handleReject() {
    if (!user || !rejecting) return
    setProcessing(rejecting.id)
    try {
      await rejectPlanRequest(rejecting, { uid: user.uid, email: user.email || "" }, adminNote)
      setRequests((rs) =>
        (rs ?? []).map((r) =>
          r.id === rejecting.id
            ? { ...r, status: "rejected" as const, adminNote: adminNote || undefined }
            : r
        )
      )
      setRejecting(null)
      setAdminNote("")
    } catch (err) {
      console.error("Reject failed:", err)
      alert("Could not reject the request — see console for details.")
    } finally {
      setProcessing(null)
    }
  }

  const usersById = new Map(users.map((u) => [u.uid, u]))
  const filtered = subs.filter((s) => {
    const u = usersById.get(s.userId)
    const q = search.trim().toLowerCase()
    const matchesQ =
      !q ||
      s.userId.toLowerCase().includes(q) ||
      u?.email?.toLowerCase().includes(q) ||
      s.stripeCustomerId?.toLowerCase().includes(q)
    const matchesStatus = filterStatus === "all" || s.status === filterStatus
    return matchesQ && matchesStatus
  })

  const active = subs.filter((s) => s.status === "active")
  const trialing = subs.filter((s) => s.status === "trialing")
  const pastDue = subs.filter((s) => s.status === "past_due")
  const canceled = subs.filter((s) => s.status === "canceled")
  const mrr = active.length * 1999 // placeholder; replace with real plan price lookup

  async function saveSub() {
    if (!editing) return
    setSaving(true)
    try {
      await updateSubscription(editing.id, editing, {
        actor: user ? { uid: user.uid, email: user.email } : undefined,
      ctx: "admin",
      })
      setSubs((prev) => prev.map((s) => (s.id === editing.id ? editing : s)))
      setEditing(null)
    } catch (err) {
      console.error("Failed to save subscription:", err)
    } finally {
      setSaving(false)
    }
  }

  async function cancel(sub: Subscription) {
    if (!confirm(`Cancel subscription for user ${sub.userId}? They keep access until period end.`)) return
    try {
      await cancelSubscription(sub.id, {
        actor: user ? { uid: user.uid, email: user.email } : undefined,
      ctx: "admin",
      })
      setSubs((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: "canceled", cancelAtPeriodEnd: true } : s))
      )
    } catch (err) {
      console.error("Failed to cancel subscription:", err)
    }
  }

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gold-light">Billing</h1>
        <p className="text-gold-light/50 text-sm mt-1">Subscriptions, payments, and revenue</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-navy/60 border border-white/5 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setTab("requests")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "requests" ? "bg-gold/15 text-gold" : "text-gold-light/50 hover:text-gold-light hover:bg-white/5"
          }`}
        >
          <Clock className="h-4 w-4" />
          Plan Requests
          {(requests?.filter((r) => r.status === "pending").length ?? 0) > 0 && (
            <span className="ml-1 rounded-full bg-gold px-1.5 py-0.5 text-[0.6rem] font-bold text-navy-dark">
              {requests!.filter((r) => r.status === "pending").length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("subscriptions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "subscriptions" ? "bg-gold/15 text-gold" : "text-gold-light/50 hover:text-gold-light hover:bg-white/5"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Subscriptions
        </button>
        <button
          onClick={() => setTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "overview" ? "bg-gold/15 text-gold" : "text-gold-light/50 hover:text-gold-light hover:bg-white/5"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Overview
        </button>
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={CheckCircle2} label="Active" value={active.length} tone="emerald" />
          <StatCard icon={Users} label="Trialing" value={trialing.length} tone="gold" />
          <StatCard icon={AlertTriangle} label="Past due" value={pastDue.length} tone={pastDue.length > 0 ? "red" : "muted"} />
          <StatCard icon={CreditCard} label="Canceled" value={canceled.length} tone="muted" />
          <div className="sm:col-span-2 lg:col-span-4 bg-navy/60 border border-white/5 rounded-xl p-6">
            <p className="text-gold-light/40 text-xs uppercase tracking-wider">Estimated MRR</p>
            <p className="font-display text-3xl font-bold text-gold-light mt-1">₹{mrr.toLocaleString("en-IN")}</p>
            <p className="text-gold-light/40 text-xs mt-2">
              * Assumes ₹1,999 per active subscription. Replace with real plan prices when Stripe is wired.
            </p>
          </div>
        </div>
      )}

      {tab === "requests" && (
        <div className="grid gap-4">
          {requests === null ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-navy/60 border border-white/5 rounded-xl p-14 text-center">
              <Clock className="mx-auto h-10 w-10 text-gold/30 mb-3" />
              <p className="text-gold-light font-display font-semibold">No plan requests yet</p>
              <p className="text-gold-light/40 text-sm mt-1">
                Customer plan requests from the dashboard appear here for approval.
              </p>
            </div>
          ) : (
            requests.map((req) => {
              const pendingReq = req.status === "pending"
              const badge =
                req.status === "pending"
                  ? "bg-amber-500/15 text-amber-400"
                  : req.status === "approved"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              return (
                <div key={req.id} className="bg-navy/60 border border-white/5 rounded-xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <p className="text-gold-light font-semibold">{req.displayName || req.email}</p>
                        <span className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${badge}`}>
                          {req.status}
                        </span>
                        <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gold">
                          {req.plan} plan
                        </span>
                      </div>
                      <p className="text-gold-light/40 text-xs mt-1">
                        {req.email} · requested {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "—"}
                      </p>
                      {req.message && (
                        <p className="text-gold-light/60 text-sm mt-2 italic">“{req.message}”</p>
                      )}
                      {req.adminNote && (
                        <p className="text-gold-light/40 text-xs mt-1">Note: {req.adminNote}</p>
                      )}
                    </div>
                    {pendingReq && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(req)}
                          disabled={processing === req.id}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => { setRejecting(req); setAdminNote("") }}
                          disabled={processing === req.id}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                        >
                          <Ban className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {tab === "subscriptions" && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-light/40" />
              <input
                type="text"
                placeholder="Search by user id, email, or Stripe id…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-navy/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-navy/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gold-light outline-none focus:border-gold/50 appearance-none cursor-pointer"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="past_due">Past due</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div className="bg-navy/60 border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gold-light/40 text-sm">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gold" />
                Loading subscriptions…
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-gold-light/40 text-sm">
                <CreditCard className="h-12 w-12 text-gold-light/15 mx-auto mb-3" />
                <p>No subscriptions match these filters.</p>
                <p className="text-xs mt-1 text-gold-light/30">
                  Subscriptions are created via the Stripe webhook — they appear here once payments succeed.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <Th>User</Th>
                      <Th>Plan</Th>
                      <Th>Status</Th>
                      <Th>Renews</Th>
                      <Th align="right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((s) => {
                      const u = usersById.get(s.userId)
                      return (
                        <tr key={s.id} className="hover:bg-white/[0.02]">
                          <Td>
                            <p className="text-sm text-gold-light">{u?.email || s.userId}</p>
                            <p className="text-[10px] font-mono text-gold-light/40 mt-0.5">{s.userId}</p>
                          </Td>
                          <Td>
                            <span className="text-xs text-gold-light/80 capitalize">{s.plan}</span>
                          </Td>
                          <Td>
                            <StatusPill status={s.status} />
                          </Td>
                          <Td>
                            <span className="text-xs text-gold-light/60">
                              {s.currentPeriodEnd
                                ? new Date(s.currentPeriodEnd).toLocaleDateString()
                                : "—"}
                            </span>
                          </Td>
                          <Td align="right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditing(s)}
                                className="px-3 py-1.5 text-xs rounded-md hover:bg-gold/10 text-gold-light/70 hover:text-gold-light transition-colors"
                              >
                                Edit
                              </button>
                              {s.status === "active" && (
                                <button
                                  onClick={() => cancel(s)}
                                  className="px-3 py-1.5 text-xs rounded-md hover:bg-red-500/10 text-red-400/70 hover:text-red-400 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </Td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => !saving && setEditing(null)}
        >
          <div
            className="bg-navy-dark border border-white/10 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-gold-light">
                Edit Subscription
              </h2>
              <button
                onClick={() => setEditing(null)}
                disabled={saving}
                className="p-1.5 rounded-md hover:bg-white/5 text-gold-light/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                  Plan
                </label>
                <select
                  value={editing.plan}
                  onChange={(e) =>
                    setEditing({ ...editing, plan: e.target.value as any })
                  }
                  className="w-full bg-navy border border-white/10 rounded-lg px-3 py-2 text-sm text-gold-light outline-none focus:border-gold/50"
                >
                  <option value="celebration">Celebration</option>
                  <option value="premium">Premium</option>
                  <option value="business">Business</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value as any })
                  }
                  className="w-full bg-navy border border-white/10 rounded-lg px-3 py-2 text-sm text-gold-light outline-none focus:border-gold/50"
                >
                  <option value="active">Active</option>
                  <option value="trialing">Trialing</option>
                  <option value="past_due">Past due</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                    Period start
                  </label>
                  <input
                    type="date"
                    value={editing.currentPeriodStart?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, currentPeriodStart: e.target.value })
                    }
                    className="w-full bg-navy border border-white/10 rounded-lg px-3 py-2 text-sm text-gold-light outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mb-1">
                    Period end
                  </label>
                  <input
                    type="date"
                    value={editing.currentPeriodEnd?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, currentPeriodEnd: e.target.value })
                    }
                    className="w-full bg-navy border border-white/10 rounded-lg px-3 py-2 text-sm text-gold-light outline-none focus:border-gold/50"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.cancelAtPeriodEnd}
                  onChange={(e) =>
                    setEditing({ ...editing, cancelAtPeriodEnd: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-gold-light/80">Cancel at period end</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setEditing(null)}
                disabled={saving}
                className="px-4 py-2 text-sm text-gold-light/60 hover:text-gold-light"
              >
                Cancel
              </button>
              <button
                onClick={saveSub}
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

      {/* Reject-with-note modal */}
      {rejecting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setRejecting(null)}
        >
          <div
            className="w-full max-w-md bg-navy border border-white/10 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-semibold text-gold-light">
              Reject plan request
            </h3>
            <p className="text-gold-light/40 text-sm mt-1">
              {rejecting.displayName || rejecting.email} — {rejecting.plan} plan
            </p>
            <label className="block text-gold-light/50 text-[10px] uppercase tracking-wider mt-5 mb-1">
              Note to customer (optional)
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="e.g. Please contact us for enterprise pricing."
              className="w-full bg-navy border border-white/10 rounded-lg px-3 py-2 text-sm text-gold-light outline-none focus:border-gold/50 resize-none"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setRejecting(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gold-light/60 hover:text-gold-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing === rejecting.id}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500/15 px-5 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-50"
              >
                {processing === rejecting.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                Reject request
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={`px-6 py-3 text-xs font-semibold text-gold-light/50 uppercase tracking-wider ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  )
}

function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <td
      className={`px-6 py-4 ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </td>
  )
}

function StatusPill({ status }: { status: Subscription["status"] }) {
  const tone =
    status === "active"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : status === "trialing"
      ? "bg-gold/15 text-gold border-gold/30"
      : status === "past_due"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : "bg-white/5 text-gold-light/50 border-white/10"
  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${tone}`}
    >
      {status.replace("_", " ")}
    </span>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "muted",
}: {
  icon: React.ElementType
  label: string
  value: number
  tone?: "muted" | "emerald" | "gold" | "red"
}) {
  const color =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "gold"
      ? "text-gold"
      : tone === "red"
      ? "text-red-400"
      : "text-gold-light/60"
  return (
    <div className="bg-navy/60 border border-white/5 rounded-xl p-5">
      <div className={`flex items-center gap-2 text-xs uppercase tracking-wider ${color}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="font-display text-3xl font-bold text-gold-light mt-2">{value}</p>
    </div>
  )
}
