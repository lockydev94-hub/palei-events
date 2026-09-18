"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Globe, QrCode, Image as ImageIcon, Upload, Calendar, Bell, BarChart3, Palette } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { features as fallbackFeatures, featureGroups as fallbackGroups } from "@/data/features";
import type { Feature } from "@/data/features";
import { getFeatures } from "@/lib/firestore";

/* ─── icon component map (inline — no dep on Icon.tsx) ────────── */
const iconComponents: Record<string, React.ElementType> = {
  globe: Globe, check: CheckCircle2, qr: QrCode,
  image: ImageIcon, upload: Upload, calendar: Calendar,
  bell: Bell, chart: BarChart3, palette: Palette, sparkles: Sparkles,
};
function FeatureIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const C = iconComponents[name] ?? Sparkles;
  return <C className={className} strokeWidth={1.75} aria-hidden />;
}

/* ─── colour accent per group ─────────────────────────────────── */
const groupAccent = ["from-gold/30 via-gold-light/20", "from-purple/30 via-rose/20", "from-sage/30 via-coral/20"];
const groupGlow   = ["rgba(200,155,60,0.18)", "rgba(155,122,203,0.18)", "rgba(147,168,138,0.18)"];
const groupBorder = ["border-gold/25 hover:border-gold/55", "border-purple/25 hover:border-purple/55", "border-sage/25 hover:border-sage/55"];
const groupIcon   = ["bg-gold/15 text-gold group-hover:bg-gold group-hover:text-navy-dark",
                     "bg-purple/15 text-purple group-hover:bg-purple group-hover:text-ivory",
                     "bg-sage/15 text-sage group-hover:bg-sage group-hover:text-navy-dark"];
const groupTag    = ["text-gold-dark border-gold/20 bg-champagne/40",
                     "text-purple border-purple/20 bg-purple/8",
                     "text-sage border-sage/20 bg-sage/8"];

/* ─── ALL feature IDs for filter tabs ─────────────────────────── */
const ALL = "all";
const tabLabels: Record<string, string> = {
  all: "All Features",
  "Event Creation": "Event Creation",
  "RSVP": "RSVP",
  "QR": "QR Code",
  "Gallery": "Gallery",
  "Guest Upload": "Guest Upload",
  "Schedule": "Schedule",
  "Notifications": "Live Updates",
  "Analytics": "Analytics",
  "Custom Branding": "Branding",
  "AI Features": "AI",
};

/* ─── Hero stat ─────────────────────────────────────────────────── */
function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-display text-2xl font-bold text-gold-light leading-none tracking-tight">{value}</span>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ivory/40">{label}</span>
    </div>
  );
}

/* ─── Premium feature card ──────────────────────────────────────── */
function FeatureCard({ feature, groupIndex }: { feature: Feature; groupIndex: number }) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-warmWhite shadow-soft
        transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated
        ${groupBorder[groupIndex] ?? groupBorder[0]}`}
    >
      {/* Top gradient accent bar */}
      <div className={`h-0.5 w-0 rounded-full bg-gradient-to-r transition-all duration-500 group-hover:w-full ${groupAccent[groupIndex] ?? groupAccent[0]}`} />

      <div className="flex flex-1 flex-col p-7">
        {/* Icon + badge row */}
        <div className="flex items-start justify-between">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${groupIcon[groupIndex] ?? groupIcon[0]}`}
          >
            <FeatureIcon name={feature.icon} className="h-5 w-5" />
          </span>
          {feature.comingSoon && (
            <span className="flex items-center gap-1.5 rounded-full border border-purple/25 bg-purple/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-purple">
              <Zap className="h-3 w-3" />
              Soon
            </span>
          )}
        </div>

        {/* Text */}
        <h3 className="mt-5 font-display text-xl font-semibold text-navy group-hover:text-navy-dark transition-colors duration-200">
          {feature.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mutedText">
          {feature.description}
        </p>

        {/* Category tag */}
        <div className={`mt-6 inline-flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 ${groupTag[groupIndex] ?? groupTag[0]}`}>
          <FeatureIcon name={feature.icon} className="h-3 w-3" />
          {feature.category}
        </div>
      </div>

      {/* Bottom glow on hover */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${groupGlow[groupIndex] ?? groupGlow[0]}, transparent 70%)` }}
        aria-hidden
      />
    </div>
  );
}

/* ─── Feature group shape (mirrors data/features.ts featureGroups) ── */
interface FeatureGroup {
  title: string
  description: string
  features: Feature[]
}

/* ─── Feature group section ────────────────────────────────────── */
function FeatureGroupSection({ group, index }: { group: FeatureGroup; index: number }) {
  const sr  = useScrollReveal({ threshold: 0.08 });
  const hsr = useScrollReveal({ threshold: 0.15 });
  const delays = ["", "sr-delay-100", "sr-delay-200", "sr-delay-300", "sr-delay-400", "sr-delay-500"];

  return (
    <div className={index % 2 === 0 ? "bg-ivory" : "bg-warmWhite"}>
      <div className="container-shell section-pad">
        {/* Heading */}
        <div ref={hsr.ref} className={`sr-fade-up ${hsr.visible ? "sr-visible" : ""}`}>
          <div className="flex items-center gap-4 mb-6">
            <span
              className="font-display text-[4rem] font-bold leading-none tracking-tight"
              style={{ color: `${groupGlow[index] ?? groupGlow[0]}`.replace("rgba(","").replace(", 0.18)",""), opacity: 0.18 }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <Badge tone={index === 0 ? "gold" : "neutral"} className="mb-2">{group.title}</Badge>
              <h2 className="font-display text-[clamp(1.7rem,2.8vw,2.4rem)] font-semibold text-navy leading-[1.1] text-balance">
                {group.title === "Event Creation" && "Stand up a beautiful event page in minutes"}
                {group.title === "Guest Experience" && "Everything your guests need, beautifully handled"}
                {group.title === "Insights & Brand" && "Know your event. Make it unmistakably yours."}
              </h2>
              <p className="mt-2 text-base text-mutedText text-pretty max-w-xl">{group.description}</p>
            </div>
          </div>
          {/* Gold rule */}
          <div className={`h-px w-20 rounded-full bg-gradient-to-r ${groupAccent[index] ?? groupAccent[0]}`} />
        </div>

        {/* Cards grid */}
        <div ref={sr.ref} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {group.features.map((feature, i) => (
            <div key={feature.id} className={`sr-rise ${delays[i] ?? ""} ${sr.visible ? "sr-visible" : ""}`}>
              <FeatureCard feature={feature} groupIndex={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Filter tab bar ────────────────────────────────────────────── */
function FilterBar({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  const tabs = [ALL, ...Object.keys(tabLabels).filter(k => k !== ALL)];
  return (
    <div className="sticky top-[72px] z-30 border-b border-navy/8 bg-ivory/95 backdrop-blur-lg shadow-[0_2px_20px_rgba(23,32,51,0.05)]">
      <div className="container-shell overflow-x-auto">
        <div className="flex items-center gap-1 py-2.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-250
                ${active === tab
                  ? "bg-gold text-navy-dark shadow-[0_0_16px_rgba(200,155,60,0.4)]"
                  : "text-navy/50 hover:text-navy/80 hover:bg-navy/5"}`}
            >
              {tabLabels[tab] ?? tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Filtered all-features grid ───────────────────────────────── */
function AllFeaturesGrid({ filter, features }: { filter: string; features: Feature[] }) {
  const shown = filter === ALL ? features : features.filter(f => f.category === filter)

  const sr = useScrollReveal({ threshold: 0.05 });
  const delays = ["", "sr-delay-100", "sr-delay-200", "sr-delay-150", "sr-delay-250", "sr-delay-300",
                  "sr-delay-100", "sr-delay-200", "sr-delay-150", "sr-delay-300"];

  // find group index for colour
  const getGroupIndex = (f: Feature) => {
    if (["Event Creation"].includes(f.category)) return 0;
    if (["RSVP","QR","Gallery","Guest Upload","Schedule","Notifications"].includes(f.category)) return 1;
    return 2;
  };

  return (
    <div ref={sr.ref} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {shown.map((feature, i) => (
        <div key={feature.id} className={`sr-rise ${delays[i] ?? ""} ${sr.visible ? "sr-visible" : ""}`}>
          <FeatureCard feature={feature} groupIndex={getGroupIndex(feature)} />
        </div>
      ))}
    </div>
  );
}

/* ─── Final CTA ─────────────────────────────────────────────────── */
function FinalCTA() {
  const sr = useScrollReveal({ threshold: 0.2 });
  return (
    <section ref={sr.ref} className={`relative overflow-hidden bg-navy-dark py-28 sr-fade-up ${sr.visible ? "sr-visible" : ""}`}>
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(200,155,60,0.6) 0%, transparent 65%)", filter: "blur(60px)" }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }} aria-hidden />
      <div className="container-shell relative z-10 text-center">
        <Badge tone="navy" className="mb-6">See it live</Badge>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold text-ivory leading-[1.1] text-balance">
          See the platform in action
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ivory/60 text-pretty">
          Explore a live demo event page to feel how every feature comes together into one seamless experience.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/e/aarav-ananya-wedding"
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gold px-9 py-4
              font-bold text-lg text-navy-dark shadow-[0_0_32px_rgba(200,155,60,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
              hover:bg-gold-light hover:-translate-y-1 hover:shadow-[0_0_56px_rgba(200,155,60,0.7)] transition-all duration-300">
            <span className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }} aria-hidden />
            View a Demo Event
          </Link>
          <Link href="/create-event"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-ivory/25 bg-white/5 backdrop-blur-md px-9 py-4
              font-bold text-lg text-ivory hover:border-ivory/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50">
          {["No credit card", "Free forever plan", "Live in 2 minutes", "10 features & counting"].map(item => (
            <span key={item} className="flex items-center gap-2 text-sm font-semibold text-ivory">
              <CheckCircle2 className="h-4 w-4 text-gold" />{item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export function FeaturesPageClient() {
  const [features, setFeatures] = useState<Feature[]>(fallbackFeatures)
  const [featureGroups, setFeatureGroups] = useState<FeatureGroup[]>(fallbackGroups)
  const [filter, setFilter] = useState(ALL);
  const showFiltered = filter !== ALL;

  useEffect(() => {
    let cancelled = false
    getFeatures()
      .then((data) => {
        if (cancelled) return
        if (data && data.length > 0) {
          setFeatures(data)
          // Keep the original group descriptions (which read like marketing copy)
          // but swap in the fresh feature list from Firestore. Only rebuild when
          // the canonical group title matches a known bucket.
          setFeatureGroups(
            fallbackGroups.map((g) => ({
              ...g,
              features: data.filter((f) => f.category === g.title),
            }))
          )
        }
      })
      .catch(() => {/* keep fallback */})
    return () => { cancelled = true }
  }, [])

  return (
    <>
      {/* ══ DARK HERO ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-navy-dark pt-32 pb-24 md:pt-44 md:pb-32">
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }} aria-hidden />
        {/* Gold glow top-right */}
        <div className="pointer-events-none absolute -right-48 -top-48 h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,155,60,0.18) 0%, rgba(200,155,60,0.06) 45%, transparent 70%)", filter: "blur(40px)" }} aria-hidden />
        {/* Purple bottom-left */}
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(155,122,203,0.12) 0%, transparent 65%)", filter: "blur(60px)" }} aria-hidden />

        <div className="container-shell relative">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb
              light
              items={[
                { label: "Home", href: "/" },
                { label: "Features" },
              ]}
            />
          </div>

          {/* Badge + live label */}
          <div className="animate-fade-up flex items-center gap-3">
            <Badge tone="navy">Features</Badge>
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold/60">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              10 features
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-7 max-w-4xl font-display font-semibold text-ivory leading-[1.06] tracking-tight animate-fade-up text-balance"
            style={{ fontSize: "clamp(2.6rem, 5.2vw, 4.5rem)", animationDelay: "100ms" }}
          >
            Everything your event{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold">needs, in one</span>
              <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full"
                style={{ background: "linear-gradient(90deg, #c89b3c 0%, #e0c584 60%, transparent 100%)", opacity: 0.45 }} aria-hidden />
            </span>{" "}platform
          </h1>

          {/* Sub */}
          <p className="mt-7 max-w-2xl text-[1.18rem] leading-[1.75] text-ivory/60 text-pretty animate-fade-up"
            style={{ animationDelay: "180ms" }}>
            Thoughtfully built features that carry your event from invitation to lasting memory —
            {" "}<span className="text-ivory/85 font-medium">beautifully connected.</span>
          </p>

          {/* Glass stats */}
          <div className="mt-10 inline-flex items-center gap-8 rounded-2xl border border-ivory/8 bg-white/5 backdrop-blur-md px-7 py-4 animate-fade-up"
            style={{ animationDelay: "260ms" }}>
            <HeroStat value="10" label="Features" />
            <span className="h-10 w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent" />
            <HeroStat value="3" label="Categories" />
            <span className="h-10 w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent" />
            <HeroStat value="1" label="Platform" />
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "340ms" }}>
            <Link href="/create-event"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gold px-9 py-4
                font-bold text-lg text-navy-dark shadow-[0_0_28px_rgba(200,155,60,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
                hover:bg-gold-light hover:-translate-y-1 hover:shadow-[0_0_52px_rgba(200,155,60,0.7)] transition-all duration-300">
              <span className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }} aria-hidden />
              Start for free
            </Link>
            <Link href="/e/aarav-ananya-wedding"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ivory/65 hover:text-gold-light transition-colors duration-200">
              View demo event <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Feature category chips */}
          <div className="mt-12 flex flex-wrap gap-2.5 animate-fade-up" style={{ animationDelay: "420ms" }}>
            {featureGroups.map((g, i) => (
              <span key={g.title}
                className="flex items-center gap-2 rounded-full border border-ivory/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-ivory/55">
                <span className="h-1.5 w-1.5 rounded-full"
                  style={{ background: i === 0 ? "#c89b3c" : i === 1 ? "#9b7acb" : "#93a88a" }} />
                {g.title} · {g.features.length}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STICKY FILTER BAR ═══════════════════════════════════════════ */}
      <FilterBar active={filter} onChange={setFilter} />

      {/* ══ FILTERED GRID VIEW ══════════════════════════════════════════ */}
      {showFiltered && (
        <div className="bg-ivory section-pad">
          <div className="container-shell">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-mutedText">
                Showing: <span className="text-navy">{tabLabels[filter] ?? filter}</span>
              </p>
              <button onClick={() => setFilter(ALL)} className="text-xs font-bold text-gold hover:text-gold-dark transition-colors">
                Clear filter ×
              </button>
            </div>
            <AllFeaturesGrid filter={filter} features={features} />

          </div>
        </div>
      )}

      {/* ══ GROUPED SECTIONS (default view) ═════════════════════════════ */}
      {!showFiltered && (
        <>
          {featureGroups.map((group, index) => (
            <FeatureGroupSection key={group.title} group={group} index={index} />
          ))}
        </>
      )}

      {/* ══ FINAL CTA ═══════════════════════════════════════════════════ */}
      <FinalCTA />
    </>
  );
}
