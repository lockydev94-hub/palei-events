"use client"

/**
 * PlanGate — what a customer sees before an admin approves a plan.
 *
 * Free customers cannot use the dashboard: this surface explains why,
 * lets them pick a plan, and submits a `planRequests` doc that the admin
 * processes in /admin/billing. Live listener → flips to "under review"
 * state the moment the request lands, and the whole portal unlocks as
 * soon as the admin approves (profile.plan is set server-side by admin).
 */
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Clock, Loader2, ShieldCheck, Sparkles, X } from "lucide-react"
import { useCustomerAuth } from "./CustomerAuthContext"
import {
  getMyPlanRequest,
  submitPlanRequest,
  subscribeToMyPlanRequests,
  type PlanRequest,
  type PlanTier,
} from "@/lib/customer"
import { getPricingPlans } from "@/lib/firestore"

const TIER_LABELS: Record<PlanTier, string> = {
  celebration: "Celebration",
  premium: "Premium",
  business: "Business",
  enterprise: "Enterprise",
}

export function PlanGate() {
  const { user, refreshPlan } = useCustomerAuth()
  const router = useRouter()

  const [plans, setPlans] = useState<{ id: string; name: string; price: string; period?: string; description: string; features: string[]; featured?: boolean }[]>([])
  const [selected, setSelected] = useState<PlanTier>("celebration")
  const [message, setMessage] = useState("")
  const [request, setRequest] = useState<PlanRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justSubmitted, setJustSubmitted] = useState(false)

  // Load pricing cards + the customer's request history.
  useEffect(() => {
    let alive = true
    getPricingPlans().then((p) => {
      if (!alive) return
      // Free tier isn't a purchase — hide it from the gate.
      const purchasable = p.filter((plan) => plan.id !== "free")
      setPlans(purchasable as typeof plans)
      if (purchasable[0]) setSelected(purchasable[0].id as PlanTier)
    })
    if (user) {
      getMyPlanRequest(user.uid).then((r) => {
        if (!alive) return
        setRequest(r)
        if (r) setSelected(r.plan)
        setLoading(false)
      })
      // Live: admin decision flips status without a reload.
      const unsub = subscribeToMyPlanRequests(user.uid, (rs) => {
        const latest = rs[0] ?? null
        setRequest(latest)
        if (latest?.status === "approved") {
          // Admin approved — refresh profile then enter the dashboard.
          refreshPlan().then(() => router.replace("/dashboard"))
        }
      })
      return () => {
        alive = false
        unsub()
      }
    }
    return () => {
      alive = false
    }
  }, [user?.uid])

  async function handleSubmit() {
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
      // Request landed — take the customer into the dashboard where the
      // Overview shows the requested plan details and live review status.
      setJustSubmitted(true)
      router.replace("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your request.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#c89b3c" }} />
      </div>
    )
  }

  const pending = request?.status === "pending"
  const rejected = request?.status === "rejected"

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f1522 0%, #172033 55%, #1a2440 100%)" }}
    >
      {/* Background glows */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,155,60,0.16) 0%, transparent 70%)", filter: "blur(60px)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-8">
        {/* Header */}
        <div className="text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em]"
            style={{ background: "rgba(200,155,60,0.12)", border: "1px solid rgba(200,155,60,0.3)", color: "#e0c584" }}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Membership required
          </span>
          <h1 className="mt-6 font-display text-[2rem] font-semibold leading-tight sm:text-[2.4rem]" style={{ color: "#fffdf8" }}>
            {pending ? "Your request is under review" : "Choose your plan to unlock your dashboard"}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[0.95rem] leading-relaxed" style={{ color: "rgba(255,253,248,0.55)" }}>
            {pending
              ? "Our team is processing your plan request. You'll get access as soon as it's approved — usually within 24 hours."
              : "The Palei Events dashboard is available with a paid plan. Pick the one that fits your celebration below and our team will set you up."}
          </p>
        </div>

        {/* ── Status cards ── */}
        {pending && (
          <div
            className="mx-auto mt-8 max-w-xl rounded-2xl p-5 text-center"
            style={{
              background: "rgba(245,158,11,0.10)",
              border: "1px solid rgba(245,158,11,0.35)",
            }}
          >
            <Clock className="mx-auto mb-2 h-6 w-6" style={{ color: "#fbbf24" }} />
            <p className="text-[0.88rem] font-semibold" style={{ color: "#fcd34d" }}>
              Requested: {request ? TIER_LABELS[request.plan] : ""} plan
            </p>
            <p className="mt-1 text-[0.78rem]" style={{ color: "rgba(255,253,248,0.5)" }}>
              Submitted {request?.createdAt ? new Date(request.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : ""} · We&apos;ll email you when it&apos;s approved.
            </p>
          </div>
        )}

        {rejected && (
          <div
            className="mx-auto mt-8 max-w-xl rounded-2xl p-5 text-center"
            style={{
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <X className="mx-auto mb-2 h-6 w-6" style={{ color: "#f87171" }} />
            <p className="text-[0.88rem] font-semibold" style={{ color: "#fca5a5" }}>
              Your previous request wasn&apos;t approved
            </p>
            {request?.adminNote && (
              <p className="mt-1 text-[0.8rem]" style={{ color: "rgba(255,253,248,0.55)" }}>
                Note from our team: {request.adminNote}
              </p>
            )}
            <p className="mt-2 text-[0.78rem]" style={{ color: "rgba(255,253,248,0.5)" }}>
              You can submit a new request below.
            </p>
          </div>
        )}

        {justSubmitted && !pending && (
          <div
            className="mx-auto mt-8 max-w-xl rounded-2xl p-5 text-center"
            style={{
              background: "rgba(16,185,129,0.10)",
              border: "1px solid rgba(16,185,129,0.35)",
            }}
          >
            <Check className="mx-auto mb-2 h-6 w-6" style={{ color: "#34d399" }} />
            <p className="text-[0.88rem] font-semibold" style={{ color: "#6ee7b7" }}>
              Request sent! Refresh in a moment to see its status.
            </p>
          </div>
        )}

        {/* ── Plan picker ── */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const active = selected === plan.id
            return (
              <button
                key={plan.id}
                onClick={() => !pending && setSelected(plan.id as PlanTier)}
                disabled={pending}
                className="relative flex flex-col rounded-2xl p-5 text-left transition-all duration-300 enabled:hover:-translate-y-1 disabled:opacity-70"
                style={{
                  background: active
                    ? "linear-gradient(160deg, rgba(200,155,60,0.16) 0%, rgba(255,253,248,0.04) 100%)"
                    : "rgba(255,253,248,0.04)",
                  border: active ? "1.5px solid rgba(200,155,60,0.55)" : "1px solid rgba(255,253,248,0.10)",
                  boxShadow: active ? "0 0 32px rgba(200,155,60,0.18)" : "none",
                }}
              >
                {plan.featured && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.14em]"
                    style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)", color: "#0f1522" }}
                  >
                    Popular
                  </span>
                )}
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em]" style={{ color: active ? "#e0c584" : "rgba(255,253,248,0.5)" }}>
                  {plan.name}
                </p>
                <p className="mt-2 font-display text-[1.5rem] font-bold" style={{ color: "#fffdf8" }}>
                  {plan.price}
                  {plan.period && (
                    <span className="ml-1 text-[0.7rem] font-normal" style={{ color: "rgba(255,253,248,0.4)" }}>
                      /{plan.period}
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-[0.72rem] leading-snug" style={{ color: "rgba(255,253,248,0.5)" }}>
                  {plan.description}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[0.72rem]" style={{ color: "rgba(255,253,248,0.65)" }}>
                      <Check className="mt-0.5 h-3 w-3 flex-shrink-0" style={{ color: "#c89b3c" }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        {/* ── Request form / state ── */}
        {!pending && (
          <div
            className="mx-auto mt-10 max-w-xl rounded-3xl p-6 sm:p-8"
            style={{
              background: "rgba(255,253,248,0.05)",
              border: "1px solid rgba(200,155,60,0.22)",
              backdropFilter: "blur(12px)",
            }}
          >
            {error && (
              <p
                className="mb-4 rounded-xl px-4 py-3 text-[0.82rem]"
                style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}
                role="alert"
              >
                {error}
              </p>
            )}
            <label htmlFor="plan-request-message" className="block text-[0.72rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,253,248,0.5)" }}>
              Anything we should know? <span style={{ color: "rgba(255,253,248,0.3)" }}>(optional)</span>
            </label>
            <textarea
              id="plan-request-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tell us about your event — date, expected guests, anything that helps us recommend the right plan."
              className="mt-2 w-full resize-none rounded-xl px-4 py-3 text-[0.88rem] outline-none transition-all"
              style={{
                background: "rgba(255,253,248,0.06)",
                border: "1px solid rgba(255,253,248,0.12)",
                color: "#fffdf8",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="group relative mt-5 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl py-4 font-semibold text-[0.95rem] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #f5dfa0 0%, #e0c584 25%, #c89b3c 60%, #a67f2e 100%)",
                boxShadow: "0 0 40px rgba(200,155,60,0.45), 0 4px 16px rgba(0,0,0,0.25)",
                color: "#0f1522",
              }}
            >
              <Sparkles className="h-4 w-4" />
              {submitting ? "Submitting…" : `Request the ${TIER_LABELS[selected]} plan`}
            </button>
            <p className="mt-3 text-center text-[0.72rem]" style={{ color: "rgba(255,253,248,0.35)" }}>
              Our team reviews requests within 24 hours. No payment is taken online.
            </p>
          </div>
        )}

        {/* Footer row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-[0.8rem]">
          <button
            onClick={() => refreshPlan()}
            className="font-medium underline-offset-2 hover:underline"
            style={{ color: "#e0c584" }}
          >
            I&apos;ve been approved — refresh access
          </button>
          <Link href="/" style={{ color: "rgba(255,253,248,0.45)" }} className="hover:text-white transition-colors">
            Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}
