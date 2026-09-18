"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Check, ArrowRight, Sparkles, Zap, Shield, Star,
  Building2, Users, Crown, Gift, ChevronDown, MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { pricingPlans as fallbackPlans, pricingNote as fallbackNote } from "@/data/pricing";
import type { PricingPlan } from "@/data/pricing";
import { getPricingPlans } from "@/lib/firestore";

/* ══════════════════════════════════════════════════════
   PLAN METADATA (icon + accent per plan)
══════════════════════════════════════════════════════ */
const PLAN_META: Record<string, {
  icon: React.ElementType;
  accent: string;
  glow: string;
  badge?: string;
}> = {
  free:         { icon: Gift,      accent: "from-sage/30 to-sage/10",      glow: "rgba(147,168,138,0.15)" },
  celebration:  { icon: Star,      accent: "from-gold/40 to-gold/10",      glow: "rgba(200,155,60,0.25)",  badge: "Most Popular" },
  premium:      { icon: Crown,     accent: "from-purple/30 to-purple/10",  glow: "rgba(155,122,203,0.18)" },
  business:     { icon: Users,     accent: "from-coral/30 to-coral/10",    glow: "rgba(242,155,122,0.18)" },
  enterprise:   { icon: Building2, accent: "from-champagne/50 to-champagne/10", glow: "rgba(232,213,168,0.25)" },
};

/* ══════════════════════════════════════════════════════
   TRUST PILL
══════════════════════════════════════════════════════ */
function TrustPill({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-ivory/55">
      <Icon className="h-4 w-4 text-gold/70 shrink-0" aria-hidden />
      <span>{text}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PRICING CARD
══════════════════════════════════════════════════════ */
function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const meta    = PLAN_META[plan.id] ?? PLAN_META.free;
  const Icon    = meta.icon;
  const isFeat  = !!plan.featured;
  const delays  = ["", "sr-delay-100", "sr-delay-200", "sr-delay-150", "sr-delay-250"];

  /* Featured card — dark navy premium treatment */
  if (isFeat) {
    return (
      <div
        className={`relative flex flex-col rounded-3xl overflow-hidden
          bg-navy-dark border border-gold/30
          shadow-[0_0_60px_rgba(200,155,60,0.18),0_24px_64px_rgba(10,15,28,0.4)]
          transition-all duration-500 hover:-translate-y-2
          hover:shadow-[0_0_90px_rgba(200,155,60,0.28),0_32px_80px_rgba(10,15,28,0.5)]
          ${delays[index] ?? ""}`}
      >
        {/* Top gold gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light" aria-hidden />

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "24px 24px" }}
          aria-hidden />

        {/* Gold ambient glow top-right */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,155,60,0.22) 0%, transparent 65%)", filter: "blur(40px)" }}
          aria-hidden />

        {/* Most Popular pill */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 rounded-b-xl bg-gold px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-navy-dark shadow-[0_4px_20px_rgba(200,155,60,0.5)]">
            <Sparkles className="h-3 w-3" aria-hidden />
            Most Popular
          </span>
        </div>

        <div className="relative flex flex-1 flex-col p-8 pt-10">
          {/* Icon + plan name */}
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 ring-1 ring-gold/30">
              <Icon className="h-5 w-5 text-gold" aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold/60">Plan</p>
              <h3 className="font-display text-xl font-semibold text-ivory leading-tight">{plan.name}</h3>
            </div>
          </div>

          {/* Price */}
          <div className="mt-7 flex items-end gap-2">
            <span className="font-display text-5xl font-bold text-champagne leading-none tracking-tight">
              {plan.price}
            </span>
            {plan.period && (
              <span className="mb-1.5 text-sm text-ivory/50">{plan.period}</span>
            )}
          </div>

          {/* Divider */}
          <div className="mt-5 h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" aria-hidden />

          {/* Description */}
          <p className="mt-5 text-sm leading-relaxed text-ivory/60">{plan.description}</p>

          {/* Features */}
          <ul className="mt-6 flex-1 space-y-3.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 ring-1 ring-gold/30">
                  <Check className="h-3 w-3 text-gold" strokeWidth={2.5} aria-hidden />
                </span>
                <span className="text-ivory/85">{f}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/create-event"
            className="group relative mt-8 inline-flex w-full items-center justify-center gap-2.5 overflow-hidden
              rounded-2xl bg-gold py-3.5 text-sm font-bold text-navy-dark
              shadow-[0_0_24px_rgba(200,155,60,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]
              hover:bg-gold-light hover:-translate-y-0.5
              hover:shadow-[0_0_40px_rgba(200,155,60,0.65)]
              transition-all duration-300"
          >
            <span
              className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%]
                group-hover:translate-x-[110%] transition-transform duration-700"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
              aria-hidden
            />
            {plan.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  /* Enterprise card — special dark treatment */
  if (plan.id === "enterprise") {
    return (
      <div className="relative col-span-full flex flex-col overflow-hidden rounded-3xl border border-champagne/20 bg-navy md:flex-row">
        {/* Left content */}
        <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-champagne/10 ring-1 ring-champagne/25">
              <Building2 className="h-5 w-5 text-champagne" aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-champagne/50">Plan</p>
              <h3 className="font-display text-xl font-semibold text-ivory">{plan.name}</h3>
            </div>
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="font-display text-4xl font-bold text-champagne leading-none">Custom</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/60">{plan.description}</p>

          <Link
            href="/contact"
            className="mt-8 inline-flex w-fit items-center gap-2.5 rounded-2xl border border-champagne/30
              bg-champagne/10 px-7 py-3.5 text-sm font-bold text-champagne backdrop-blur-sm
              hover:bg-champagne/20 hover:border-champagne/50 hover:-translate-y-0.5
              hover:shadow-[0_8px_32px_rgba(232,213,168,0.2)]
              transition-all duration-300"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Contact Sales
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Right features */}
        <div className="border-t border-champagne/10 p-8 md:border-l md:border-t-0 md:p-10 md:min-w-[340px]">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-champagne/50">Everything included</p>
          <ul className="space-y-3.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-champagne/15 ring-1 ring-champagne/25">
                  <Check className="h-3 w-3 text-champagne" strokeWidth={2.5} aria-hidden />
                </span>
                <span className="text-ivory/80">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ambient corner glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,213,168,0.12) 0%, transparent 65%)", filter: "blur(50px)" }}
          aria-hidden />
      </div>
    );
  }

  /* Standard card — light premium */
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-navy/10 bg-warmWhite
        shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated hover:border-navy/20"
    >
      {/* Top gradient accent on hover */}
      <div
        className={`h-0.5 w-0 rounded-full bg-gradient-to-r ${meta.accent} transition-all duration-500 group-hover:w-full`}
        aria-hidden
      />

      {/* Bottom hover glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${meta.glow}, transparent 70%)` }}
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col p-8">
        {/* Icon + plan name */}
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy/6 ring-1 ring-navy/10
            group-hover:bg-gold/10 group-hover:ring-gold/25 transition-all duration-300">
            <Icon className="h-5 w-5 text-navy/50 group-hover:text-gold transition-colors duration-300" aria-hidden />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mutedText/70">Plan</p>
            <h3 className="font-display text-xl font-semibold text-navy leading-tight">{plan.name}</h3>
          </div>
        </div>

        {/* Price */}
        <div className="mt-7 flex items-end gap-2">
          <span className="font-display text-5xl font-bold text-navy leading-none tracking-tight">
            {plan.price}
          </span>
          {plan.period && (
            <span className="mb-1.5 text-sm text-mutedText">{plan.period}</span>
          )}
        </div>

        {/* Divider */}
        <div className="mt-5 h-px bg-gradient-to-r from-navy/10 via-navy/5 to-transparent" aria-hidden />

        {/* Description */}
        <p className="mt-5 text-sm leading-relaxed text-mutedText">{plan.description}</p>

        {/* Features */}
        <ul className="mt-6 flex-1 space-y-3.5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/20">
                <Check className="h-3 w-3 text-gold-dark" strokeWidth={2.5} aria-hidden />
              </span>
              <span className="text-navy/80">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={plan.id === "enterprise" ? "/contact" : "/create-event"}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-navy/20
            py-3.5 text-sm font-bold text-navy
            hover:border-navy hover:bg-navy hover:text-ivory hover:shadow-md hover:-translate-y-0.5
            transition-all duration-300"
        >
          {plan.cta}
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FAQ ITEM
══════════════════════════════════════════════════════ */
const FAQS = [
  {
    q: "Can I switch plans after creating an event?",
    a: "Yes — you can upgrade at any time and your event data carries over seamlessly. Downgrading applies from your next event.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Every account starts on the Free plan so you can explore the platform. Paid plans unlock immediately upon payment.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major cards, UPI, net banking, and popular wallets through our secure payment gateway.",
  },
  {
    q: "Do you offer refunds?",
    a: "If your event hasn't gone live yet, we offer a full refund within 7 days of purchase. Contact support and we'll sort it out.",
  },
  {
    q: "What counts as 'per event' pricing?",
    a: "Each unique event page you create counts as one event. You can share it with unlimited guests and keep it live as long as you need.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-navy/8 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-semibold text-navy pr-2">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-mutedText">{a}</p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   COMPARISON TABLE
══════════════════════════════════════════════════════ */
const COMPARE_ROWS = [
  { label: "Event pages",        free: "1",        celebration: "1",   premium: "1",          business: "Unlimited" },
  { label: "Guest uploads",      free: "—",        celebration: "✓",   premium: "✓",          business: "✓"         },
  { label: "RSVP management",    free: "—",        celebration: "✓",   premium: "✓",          business: "✓"         },
  { label: "QR code access",     free: "—",        celebration: "✓",   premium: "✓",          business: "✓"         },
  { label: "Custom branding",    free: "—",        celebration: "—",   premium: "✓",          business: "✓"         },
  { label: "Analytics",          free: "—",        celebration: "—",   premium: "✓",          business: "Advanced"  },
  { label: "Team accounts",      free: "—",        celebration: "—",   premium: "—",          business: "✓"         },
  { label: "Priority support",   free: "—",        celebration: "—",   premium: "✓",          business: "✓"         },
];

function CompareTable() {
  const headers = ["Feature", "Free", "Celebration", "Premium", "Business"];
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy/10 shadow-soft">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy/8 bg-warmWhite">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`px-6 py-4 text-left font-bold uppercase tracking-[0.12em] text-[11px]
                  ${i === 2 ? "bg-navy/5 text-gold-dark" : "text-mutedText"}`}
              >
                {i === 2 ? (
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-gold" aria-hidden />
                    {h}
                  </span>
                ) : h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy/5 bg-ivory">
          {COMPARE_ROWS.map((row) => (
            <tr key={row.label} className="transition-colors duration-150 hover:bg-warmWhite">
              <td className="px-6 py-3.5 font-medium text-navy/80">{row.label}</td>
              {([row.free, row.celebration, row.premium, row.business] as string[]).map((val, i) => (
                <td
                  key={i}
                  className={`px-6 py-3.5 text-center font-medium
                    ${i === 1 ? "bg-navy/3 text-gold-dark" : ""}
                    ${val === "—" ? "text-navy/20" : val === "✓" ? "text-sage" : "text-navy/75"}`}
                >
                  {val === "✓" ? <Check className="mx-auto h-4 w-4" strokeWidth={2.5} aria-hidden /> : val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export function PricingPageClient() {
  // Firestore-driven; falls back to hardcoded data on the client if the
  // collection is empty or unreachable. This keeps SEO crawlers and
  // first-paint users always seeing something.
  const [plans, setPlans] = useState<PricingPlan[]>(fallbackPlans)
  const [pricingNote, setPricingNote] = useState<string>(fallbackNote)

  useEffect(() => {
    let cancelled = false
    getPricingPlans()
      .then((data) => {
        if (cancelled) return
        if (data && data.length > 0) setPlans(data)
      })
      .catch(() => {/* keep fallback */})
    return () => { cancelled = true }
  }, [])

  const standardPlans = plans.filter((p) => p.id !== "enterprise")
  const enterprise = plans.find((p) => p.id === "enterprise")

  const heroSr  = useScrollReveal({ threshold: 0.05 });
  const cardSr  = useScrollReveal({ threshold: 0.04 });
  const tableSr = useScrollReveal({ threshold: 0.08 });
  const faqSr   = useScrollReveal({ threshold: 0.08 });

  const cardDelays = ["", "sr-delay-100", "sr-delay-200", "sr-delay-150"];

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          CINEMATIC DARK HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-navy-dark pt-32 pb-28 md:pt-44 md:pb-36">
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }}
          aria-hidden />
        {/* Gold orb top-right */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,155,60,0.20) 0%, rgba(200,155,60,0.05) 50%, transparent 70%)", filter: "blur(50px)" }}
          aria-hidden />
        {/* Purple orb bottom-left */}
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(155,122,203,0.12) 0%, transparent 65%)", filter: "blur(70px)" }}
          aria-hidden />
        {/* Rose bottom-centre */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[200px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(232,140,155,0.07) 0%, transparent 65%)", filter: "blur(50px)" }}
          aria-hidden />

        <div className="container-shell relative">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb
              light
              items={[
                { label: "Home", href: "/" },
                { label: "Pricing" },
              ]}
            />
          </div>

          {/* Eyebrow */}
          <div className="animate-fade-up flex items-center gap-3">
            <Badge tone="navy">Pricing</Badge>
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold/55">
              <Zap className="h-3 w-3 text-gold animate-pulse" aria-hidden />
              No hidden fees
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-7 max-w-4xl font-display font-semibold text-ivory leading-[1.06] tracking-tight animate-fade-up text-balance"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)", animationDelay: "100ms" }}
          >
            Simple pricing for{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold">every celebration</span>
              <span
                className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full"
                style={{ background: "linear-gradient(90deg, #c89b3c 0%, #e0c584 60%, transparent 100%)", opacity: 0.45 }}
                aria-hidden
              />
            </span>
          </h1>

          {/* Sub-copy */}
          <p
            className="mt-7 max-w-2xl text-[1.15rem] leading-[1.8] text-ivory/60 text-pretty animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            Start free and upgrade when your event needs more.{" "}
            <span className="font-medium text-ivory/85">No contracts, cancel anytime.</span>
          </p>

          {/* Trust pills row */}
          <div className="mt-10 flex flex-wrap gap-6 animate-fade-up" style={{ animationDelay: "260ms" }}>
            <TrustPill icon={Shield}   text="Secure payment gateway" />
            <TrustPill icon={Zap}      text="Live in under 2 minutes" />
            <TrustPill icon={Star}     text="Free forever plan" />
            <TrustPill icon={Check}    text="No credit card required" />
          </div>

          {/* Demo note pill */}
          <div
            className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-gold/20 bg-gold/8
              px-5 py-2.5 text-sm text-gold-dark backdrop-blur-sm animate-fade-up"
            style={{ animationDelay: "340ms" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-gold shrink-0" aria-hidden />
            <span className="text-ivory/60">{pricingNote}</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRICING CARDS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-ivory section-pad">
        <div className="container-shell">
          {/* Standard plans grid */}
          <div
            ref={cardSr.ref}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {standardPlans.map((plan, i) => (
              <div
                key={plan.id}
                className={`sr-rise ${cardDelays[i] ?? ""} ${cardSr.visible ? "sr-visible" : ""}
                  ${plan.featured ? "md:col-span-2 xl:col-span-1" : ""}`}
              >
                <PricingCard plan={plan} index={i} />
              </div>
            ))}
          </div>

          {/* Enterprise — full width below */}
          {enterprise && (
            <div className={`mt-6 sr-rise sr-delay-300 ${cardSr.visible ? "sr-visible" : ""}`}>
              <PricingCard plan={enterprise} index={4} />
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          COMPARISON TABLE
      ══════════════════════════════════════════════════════ */}
      <section className="bg-warmWhite section-pad">
        <div className="container-shell">
          <div
            ref={tableSr.ref}
            className={`sr-fade-up ${tableSr.visible ? "sr-visible" : ""}`}
          >
            <div className="mb-10 text-center">
              <Badge tone="gold" className="mb-4">Compare plans</Badge>
              <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold text-navy leading-[1.1] text-balance">
                Everything side by side
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-mutedText text-pretty">
                See exactly what's included in each plan so you can pick the right fit.
              </p>
            </div>
            <CompareTable />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════ */}
      <section className="bg-ivory section-pad">
        <div className="container-shell">
          <div
            ref={faqSr.ref}
            className={`sr-fade-up ${faqSr.visible ? "sr-visible" : ""}`}
          >
            <div className="mx-auto max-w-2xl">
              <div className="mb-10 text-center">
                <Badge tone="neutral" className="mb-4">FAQ</Badge>
                <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold text-navy leading-[1.1]">
                  Common questions
                </h2>
              </div>
              <div className="rounded-2xl border border-navy/8 bg-warmWhite px-8 shadow-soft">
                {FAQS.map((item) => (
                  <FaqItem key={item.q} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-navy-dark py-28">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(200,155,60,0.6) 0%, transparent 65%)", filter: "blur(60px)" }}
          aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }}
          aria-hidden />

        <div className="container-shell relative z-10 text-center">
          <Badge tone="navy" className="mb-6">Ready to start?</Badge>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold text-ivory leading-[1.1] text-balance">
            Your event deserves to be{" "}
            <span className="text-gradient-gold">remembered.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ivory/60 text-pretty">
            Start for free — no card needed. Upgrade when you're ready.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/create-event"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gold px-9 py-4
                font-bold text-lg text-navy-dark
                shadow-[0_0_32px_rgba(200,155,60,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
                hover:bg-gold-light hover:-translate-y-1 hover:shadow-[0_0_56px_rgba(200,155,60,0.7)]
                transition-all duration-300"
            >
              <span className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%]
                group-hover:translate-x-[110%] transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
                aria-hidden />
              Start Free Today
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-ivory/25
                bg-white/5 backdrop-blur-md px-9 py-4 font-bold text-lg text-ivory
                hover:border-ivory/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              Talk to Sales <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50">
            {["No credit card", "Free forever plan", "Cancel anytime", "Live in 2 minutes"].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm font-semibold text-ivory">
                <Check className="h-4 w-4 text-gold" />{item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
