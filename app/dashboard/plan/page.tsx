"use client"

/**
 * Plan & Billing (customer view).
 * Shows the current plan + active subscription, lets the customer request
 * a change (creates a planRequest the admin processes), and lists the
 * request history.
 */
import { useEffect, useState } from "react"
import { Check, Clock, CreditCard, Loader2, Sparkles, XCircle } from "lucide-react"
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext"
import { PageHeader, Card } from "@/components/customer/DashboardShell"
import {
  getMyPlanRequests,
  submitPlanRequest,
  subscribeToMyPlanRequests,
  type PlanRequest,
  type PlanTier,
} from "@/lib/customer"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import type { Subscription } from "@/lib/firestore"

const TIER_LABELS: Record<PlanTier, string> = {
  celebration: "Celebration",
  premium: "Premium",
  business: "Business",
  enterprise: "Enterprise",
}

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: "rgba(245,158,11,0.12)", color: "#d97706", label: "Under review" },
  approved: { bg: "rgba(16,185,129,0.12)", color: "#059669", label: "Approved" },
  rejected: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", label: "Not approved" },
}

export default function CustomerPlanPage() {
  const { user, refreshPlan } = useCustomerAuth()
  const [request, setRequest] = useState<PlanRequest | null>(null)
  const [history, setHistory] = useState<PlanRequest[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [selected, setSelected] = useState<PlanTier>("premium")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    // History (fires once + on admin decisions)
    getMyPlanRequests(user.uid).then(setHistory)
    const unsub = subscribeToMyPlanRequests(user.uid, (rs) => {
      setHistory(rs)
      setRequest(rs.find((r) => r.status === "pending") ?? rs[0] ?? null)
      // Approval flips profile.plan server-side; refresh local auth state.
      if (rs.some((r) => r.status === "approved")) refreshPlan()
    })
    // Own subscription (rules: userId == auth.uid)
    const subsQ = query(collection(db, "subscriptions"), where("userId", "==", user.uid))
    const unsubSubs = onSnapshot(
      subsQ,
      (snap) => setSubscription((snap.docs[0]?.data() as Subscription) ?? null),
      (err) => console.warn("[customer] subscription listener:", err)
    )
    return () => {
      unsub()
      unsubSubs()
    }
  }, [user?.uid])

  async function handleRequest() {
    if (!user) return
    setSubmitting(true)
    setError(null)
    try {
      await submitPlanRequest({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || undefined,
        plan: selected,
        message: message.trim() || undefined,
      })
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the request.")
    } finally {
      setSubmitting(false)
    }
  }

  const pending = request?.status === "pending"
  const planLabel = user?.plan === "free" ? "No plan" : user?.plan

  return (
    <div>
      <PageHeader
        title="Plan & billing"
        subtitle="Your membership, subscription status and plan requests."
      />

      {/* Current plan card */}
      <Card className="mb-6 overflow-hidden">
        <div
          className="flex flex-wrap items-center gap-4 px-6 py-5"
          style={{ background: "linear-gradient(135deg, rgba(200,155,60,0.10), rgba(200,155,60,0.03))" }}
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(135deg, #c89b3c, #a67f2e)", color: "#0f1522" }}
          >
            <CreditCard className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mutedText">
              Current plan
            </p>
            <p className="font-display text-xl font-bold capitalize text-navy">{planLabel}</p>
          </div>
          {subscription && (
            <div className="text-right">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mutedText">Status</p>
              <p
                className="rounded-full px-3 py-1 text-[0.72rem] font-bold uppercase tracking-wider"
                style={{
                  background:
                    subscription.status === "active" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                  color: subscription.status === "active" ? "#059669" : "#d97706",
                }}
              >
                {subscription.status}
              </p>
            </div>
          )}
          {subscription?.currentPeriodEnd && (
            <p className="text-[0.78rem] text-mutedText">
              Renews{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </Card>

      {/* Pending request banner */}
      {pending && (
        <div
          className="mb-6 flex items-center gap-3 rounded-2xl px-5 py-4"
          style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.35)" }}
        >
          <Clock className="h-5 w-5 flex-shrink-0" style={{ color: "#f59e0b" }} />
          <p className="text-[0.86rem]" style={{ color: "#92400e" }}>
            Your request for the <strong>{request ? TIER_LABELS[request.plan] : ""}</strong> plan is under review.
          </p>
        </div>
      )}

      {/* Upgrade / change request */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
            <Sparkles className="h-4.5 w-4.5 text-gold" />
            {user?.plan === "free" ? "Request a plan" : "Change plan"}
          </h2>
          <p className="mt-1 text-[0.83rem] text-mutedText">
            Pick a plan and our team will set it up for you — no online payment needed.
          </p>

          {error && (
            <p
              className="mt-4 rounded-xl px-4 py-3 text-[0.82rem]"
              style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c" }}
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {(Object.keys(TIER_LABELS) as PlanTier[]).map((tier) => {
              const active = selected === tier
              return (
                <button
                  key={tier}
                  onClick={() => setSelected(tier)}
                  disabled={pending}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[0.86rem] font-semibold transition-all disabled:opacity-50"
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, rgba(200,155,60,0.14), rgba(200,155,60,0.05))",
                          border: "1.5px solid rgba(200,155,60,0.55)",
                          color: "#a67f2e",
                        }
                      : { border: "1px solid rgba(23,32,51,0.12)", color: "#374151", background: "rgba(255,253,248,0.8)" }
                  }
                >
                  {TIER_LABELS[tier]}
                  {active && <Check className="h-4 w-4" />}
                </button>
              )
            })}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Anything we should know? (optional)"
            className="mt-4 w-full resize-none rounded-xl px-4 py-3 text-[0.88rem] text-navy outline-none transition-all"
            style={{ background: "rgba(255,253,248,0.95)", border: "1px solid rgba(23,32,51,0.12)" }}
          />

          <button
            onClick={handleRequest}
            disabled={submitting || pending}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[0.88rem] font-semibold text-navy-dark transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #e0c584, #c89b3c)",
              boxShadow: "0 0 24px rgba(200,155,60,0.3)",
            }}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Request under review" : submitting ? "Submitting…" : "Submit request"}
          </button>
        </Card>

        {/* Request history */}
        <Card className="p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-navy">Request history</h2>
          {history.length === 0 ? (
            <p className="mt-3 text-[0.85rem] text-mutedText">
              No plan requests yet — submit one when you&apos;re ready.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {history.map((r) => {
                const badge = STATUS_BADGE[r.status] ?? STATUS_BADGE.pending
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(23,32,51,0.03)" }}
                  >
                    <div>
                      <p className="text-[0.85rem] font-semibold capitalize text-navy">
                        {TIER_LABELS[r.plan] ?? r.plan}
                      </p>
                      <p className="text-[0.72rem] text-mutedText">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                        {r.adminNote ? ` · “${r.adminNote}”` : ""}
                      </p>
                    </div>
                    <span
                      className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {r.status === "rejected" && <XCircle className="h-3 w-3" />}
                      {badge.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
