"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  ExternalLink,
  Heart,
  Loader2,
  Mail,
  Plus,
  Sparkles,
  Users,
} from "lucide-react"
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext"
import { PageHeader, Card } from "@/components/customer/DashboardShell"
import { subscribeToMyEvents, subscribeToRsvps, subscribeToWishes } from "@/lib/customer"
import type { FirestoreEvent } from "@/lib/firestore"

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

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.displayName?.split(" ")[0] || "there"} ✨`}
        subtitle="Here's what's happening across your events."
        action={
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
        }
      />

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
              <p className="text-[0.75rem] text-mutedText">See who's coming</p>
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
