"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Heart,
  Loader2,
  Mail,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext"
import { PageHeader, Card } from "@/components/customer/DashboardShell"
import {
  subscribeToMyPlanRequests,
  type PlanRequest,
  type PlanTier,
} from "@/lib/customer"
import { subscribeToMyEvents, subscribeToRsvps, subscribeToWishes } from "@/lib/customer"
import type { FirestoreEvent } from "@/lib/firestore"

const TIER_LABELS: Record<PlanTier, string> = {
  celebration: "Celebration",
  premium: "Premium",
  business: "Business",
  enterprise: "Enterprise",
}

/**
 * Requested-plan details card — the first thing a free customer sees after
 * requesting a plan. Live: flips to a success state the moment the admin
 * activates the plan (profile listener updates `user.plan`).
 */
function RequestedPlanCard({ plan }: { plan: string }) {
  const { user } = useCustomerAuth()
  const [request, setRequest] = useState<PlanRequest | null>(null)
  const pending = request?.status === "pending"
  const rejected = request?.status === "rejected"

  useEffect(() => {
    if (!user) return
    return subscribeToMyPlanRequests(user.uid, (rs) => {
      setRequest(rs.find((r) => r.status === "pending") ?? rs[0] ?? null)
    })
  }, [user?.uid])

  return (
    <div
      className="mb-8 overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(160deg, #0f1522 0%, #172033 100%)",
        border: "1px solid rgba(200,155,60,0.25)",
        boxShadow: "0 12px 40px rgba(15,21,34,0.25)",
      }}
    >
      <div className="flex flex-wrap items-center gap-5 px-6 py-6">
        <span
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: pending
              ? "rgba(245,158,11,0.15)"
              : "linear-gradient(135deg, #c89b3c, #a67f2e)",
            color: pending ? "#fbbf24" : "#0f1522",
          }}
        >
          {pending ? <Clock className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,253,248,0.45)" }}>
            {pending ? "Plan requested — under review" : rejected ? "Previous request not approved" : "Plan status"}
          </p>
          <p className="mt-1 font-display text-xl font-bold" style={{ color: "#fffdf8" }}>
            {TIER_LABELS[request?.plan as PlanTier] ?? plan}
            {pending ? " plan" : ""}
          </p>
          <p className="mt-1 text-[0.8rem]" style={{ color: "rgba(255,253,248,0.55)" }}>
            {pending
              ? request?.message
                ? `Your note: “${request.message}” · Submitted ${
                    request.createdAt
                      ? new Date(request.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
                      : ""
                  }`
                : `Submitted ${
                    request?.createdAt
                      ? new Date(request.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
                      : ""
                  } — our team reviews within 24 hours. This page unlocks automatically when your plan activates.`
              : rejected
              ? request?.adminNote
                ? `Note from our team: “${request.adminNote}”. You can submit a new request from Plan & Billing.`
                : "You can submit a new request from Plan & Billing."
              : "Your plan is active."}
          </p>
        </div>
        <span
          className="rounded-full px-3.5 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.14em]"
          style={{
            background: pending
              ? "rgba(245,158,11,0.14)"
              : rejected
              ? "rgba(239,68,68,0.14)"
              : "rgba(16,185,129,0.14)",
            color: pending ? "#fbbf24" : rejected ? "#f87171" : "#34d399",
          }}
        >
          {pending ? "Under review" : rejected ? "Rejected" : "Active"}
        </span>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  accent = "#c89b3c",
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  href: string
  accent?: string
}) {
  return (
    <Link href={href}>
      <Card className="group p-5 transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center gap-4">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${accent}22, ${accent}0a)`,
              border: `1px solid ${accent}44`,
              color: accent,
            }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mutedText">
              {label}
            </p>
            <p className="mt-0.5 font-display text-2xl font-bold text-navy">{value}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default function CustomerOverviewPage() {
  const { user } = useCustomerAuth()
  const [events, setEvents] = useState<FirestoreEvent[] | null>(null)
  const [rsvpCount, setRsvpCount] = useState<number | null>(null)
  const [wishCount, setWishCount] = useState<number | null>(null)

  useEffect(() => {
    if (!user) return
    const unsubE = subscribeToMyEvents(user.uid, setEvents)
    const unsubR = subscribeToRsvps(user.uid, (rs) => setRsvpCount(rs.length))
    const unsubW = subscribeToWishes(user.uid, (ws) => setWishCount(ws.length))
    return () => {
      unsubE()
      unsubR()
      unsubW()
    }
  }, [user?.uid])

  const published = events?.filter((e) => e.status === "published").length ?? 0
  const loading = events === null
  const planActive = user?.plan !== "free"

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.displayName?.split(" ")[0] || "there"} ✨`}
        subtitle={planActive ? "Here's what's happening across your events." : "Your plan activation status is shown below."}
        action={
          planActive ? (
            <Link
              href="/dashboard/events/new"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.85rem] font-semibold text-navy-dark transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #e0c584, #c89b3c)",
                boxShadow: "0 0 24px rgba(200,155,60,0.35)",
              }}
            >
              <Plus className="h-4 w-4" />
              Create event
            </Link>
          ) : (
            <Link
              href="/dashboard/plan"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.85rem] font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                border: "1px solid rgba(200,155,60,0.4)",
                background: "rgba(200,155,60,0.08)",
                color: "#a67f2e",
              }}
            >
              <Sparkles className="h-4 w-4" />
              View plan options
            </Link>
          )
        }
      />

      {/* Requested plan details (free customers see this first) */}
      {user?.plan === "free" && <RequestedPlanCard plan={user.plan} />}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Total events" value={loading ? "…" : events!.length} href="/dashboard/events" />
        <StatCard icon={Sparkles} label="Published" value={loading ? "…" : published} href="/dashboard/events" accent="#10b981" />
        <StatCard icon={Users} label="RSVPs received" value={rsvpCount === null ? "…" : rsvpCount} href="/dashboard/rsvps" accent="#3b82f6" />
        <StatCard icon={Heart} label="Wishes" value={wishCount === null ? "…" : wishCount} href="/dashboard/wishes" accent="#ec4899" />
      </div>

      {/* Recent events */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy">Recent events</h2>
          <Link href="/dashboard/events" className="text-[0.82rem] font-medium text-gold-dark hover:text-gold transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <Card className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </Card>
        ) : events!.length === 0 ? (
          <Card className="p-12 text-center">
            <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gold/40" />
            <p className="font-display text-lg font-semibold text-navy">No events yet</p>
            {planActive ? (
              <>
                <p className="mx-auto mt-1 max-w-sm text-[0.85rem] text-mutedText">
                  Create your first event page — it takes about five minutes and guests can RSVP immediately.
                </p>
                <Link
                  href="/dashboard/events/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[0.85rem] font-semibold text-navy-dark"
                  style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)" }}
                >
                  <Plus className="h-4 w-4" /> Create your first event
                </Link>
              </>
            ) : (
              <p className="mx-auto mt-1 max-w-sm text-[0.85rem] text-mutedText">
                Event creation unlocks as soon as your plan is activated by our team.
              </p>
            )}
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events!.slice(0, 6).map((e) => (
              <Card key={e.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-navy leading-snug">{e.name}</p>
                    <span
                      className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider"
                      style={{
                        background: e.status === "published" ? "rgba(16,185,129,0.12)" : e.status === "draft" ? "rgba(245,158,11,0.12)" : "rgba(107,114,128,0.12)",
                        color: e.status === "published" ? "#059669" : e.status === "draft" ? "#d97706" : "#6b7280",
                      }}
                    >
                      {e.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.78rem] text-mutedText">
                    {new Date(e.startDate).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                    {e.venue?.city ? ` · ${e.venue.city}` : ""}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Link href={`/dashboard/events/${e.id}`} className="text-[0.8rem] font-semibold text-gold-dark hover:text-gold">
                      Manage
                    </Link>
                    {e.status === "published" && (
                      <Link
                        href={`/e/${e.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[0.8rem] text-mutedText hover:text-navy"
                      >
                        <ExternalLink className="h-3 w-3" /> Live page
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/rsvps">
          <Card className="flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5">
            <Mail className="h-5 w-5 text-gold" />
            <div>
              <p className="text-[0.85rem] font-semibold text-navy">Guest RSVPs</p>
              <p className="text-[0.75rem] text-mutedText">See who&apos;s coming</p>
            </div>
          </Card>
        </Link>
        <Link href="/dashboard/wishes">
          <Card className="flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5">
            <Heart className="h-5 w-5 text-gold" />
            <div>
              <p className="text-[0.85rem] font-semibold text-navy">Wish wall</p>
              <p className="text-[0.75rem] text-mutedText">Read guest messages</p>
            </div>
          </Card>
        </Link>
        <Link href="/dashboard/plan">
          <Card className="flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5">
            <Sparkles className="h-5 w-5 text-gold" />
            <div>
              <p className="text-[0.85rem] font-semibold text-navy">Plan & billing</p>
              <p className="text-[0.75rem] text-mutedText">Manage your subscription</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
