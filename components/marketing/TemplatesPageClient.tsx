"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Search, ArrowRight, CheckCircle2, Sparkles, SlidersHorizontal, X, Eye, Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { templates, templateCategories, templateStyles } from "@/data/templates";
import type { Template } from "@/data/templates";

/* ════════════════════════════════════════════════════════════════
   CATEGORY → colour accent mapping
════════════════════════════════════════════════════════════════ */
const CAT_ACCENT: Record<string, { border: string; glow: string; tag: string }> = {
  wedding:    { border: "border-gold/30 hover:border-gold/65",    glow: "rgba(200,155,60,0.2)",   tag: "bg-gold/10 text-gold-dark border-gold/25" },
  birthday:   { border: "border-rose/30 hover:border-rose/65",    glow: "rgba(232,140,155,0.2)",  tag: "bg-rose/10 text-rose border-rose/25" },
  corporate:  { border: "border-purple/30 hover:border-purple/65",glow: "rgba(155,122,203,0.2)",  tag: "bg-purple/10 text-purple border-purple/25" },
  school:     { border: "border-sage/30 hover:border-sage/65",    glow: "rgba(147,168,138,0.2)",  tag: "bg-sage/10 text-sage border-sage/25" },
  college:    { border: "border-coral/30 hover:border-coral/65",  glow: "rgba(242,155,122,0.2)",  tag: "bg-coral/10 text-coral border-coral/25" },
  government: { border: "border-gold-dark/35 hover:border-gold-dark/65", glow: "rgba(166,127,46,0.2)", tag: "bg-champagne text-navy-dark border-gold-dark/40" },
  cultural:   { border: "border-rose/30 hover:border-rose/55",    glow: "rgba(232,140,155,0.18)", tag: "bg-rose/8 text-rose border-rose/20" },
  sports:     { border: "border-gold/30 hover:border-gold/55",    glow: "rgba(200,155,60,0.18)",  tag: "bg-gold/8 text-gold-dark border-gold/20" },
};
const DEFAULT_ACCENT = CAT_ACCENT.wedding;

function accent(cat: string) {
  return CAT_ACCENT[cat.toLowerCase()] ?? DEFAULT_ACCENT;
}

/* ════════════════════════════════════════════════════════════════
   STAT PILL
════════════════════════════════════════════════════════════════ */
function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-2xl font-bold text-gold-light leading-none tracking-tight">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ivory/40">{label}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TEMPLATE CARD
════════════════════════════════════════════════════════════════ */
function TemplateCard({ template }: { template: Template }) {
  const href = template.demoSlug ? `/e/${template.demoSlug}` : "/e/aarav-ananya-wedding";
  const { border, glow, tag } = accent(template.category);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-warmWhite
        shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated ${border}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line */}
      <div
        className="h-0.5 w-0 rounded-full bg-gradient-to-r from-gold/60 via-gold-light/40 to-transparent
          transition-all duration-500 group-hover:w-full"
        aria-hidden
      />

      {/* ── Image area ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-dark">
        <Image
          src={template.preview}
          alt={`${template.name} template preview`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        />

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />

        {/* Mouse-follow shimmer */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(280px circle at 50% 50%, rgba(200,155,60,0.18), transparent 70%)" }}
          aria-hidden
        />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge tone="navy">{template.category}</Badge>
          <Badge tone="neutral">{template.style}</Badge>
          {template.featured && (
            <span className="flex items-center gap-1 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-navy-dark shadow-sm">
              <Sparkles className="h-2.5 w-2.5" aria-hidden />
              Featured
            </span>
          )}
        </div>

        {/* Quick preview CTA (visible on hover) */}
        <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
          <Link
            href={href}
            className="flex items-center gap-2 rounded-full bg-white/12 px-5 py-2.5 text-sm font-semibold
              text-white backdrop-blur-md border border-white/20
              transition-all duration-300 hover:bg-white/22 hover:scale-105"
          >
            <Eye className="h-4 w-4" aria-hidden />
            Quick Preview
          </Link>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col p-6">
        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${glow}, transparent 70%)` }}
          aria-hidden
        />

        {/* Category tag */}
        <span className={`relative mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${tag}`}>
          {template.category}
        </span>

        <h3 className="relative font-display text-xl font-semibold text-navy transition-colors duration-300 group-hover:text-navy-dark">
          {template.name}
        </h3>
        <p className="relative mt-2 flex-1 text-sm leading-relaxed text-mutedText">
          {template.description}
        </p>

        {/* Actions */}
        <div className="relative mt-6 flex items-stretch gap-3">
          <Link
            href={href}
            className="flex-1 rounded-xl border border-navy/18 py-2.5 text-center text-sm font-semibold
              text-navy transition-all duration-300
              hover:border-navy hover:bg-navy hover:text-ivory hover:shadow-md"
          >
            View Demo
          </Link>
          <Link
            href="/create-event"
            className="group/btn flex-1 relative overflow-hidden rounded-xl bg-gold py-2.5 text-center text-sm font-semibold
              text-navy-dark transition-all duration-300
              hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(200,155,60,0.5)]"
          >
            <span
              className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%]
                group-hover/btn:translate-x-[110%] transition-transform duration-600"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
              aria-hidden
            />
            Use Template
          </Link>
        </div>

        {/* Growing bottom accent */}
        <div className="mt-4 h-0.5 w-0 rounded-full bg-gradient-to-r from-gold/50 to-gold-light/30 transition-all duration-500 group-hover:w-full" aria-hidden />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CATEGORY PILL FILTER
════════════════════════════════════════════════════════════════ */
function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-250
        ${active
          ? "bg-gold text-navy-dark shadow-[0_0_18px_rgba(200,155,60,0.4)] scale-105"
          : "border border-navy/15 text-navy/60 hover:border-gold/40 hover:text-navy hover:bg-gold/5"
        }`}
    >
      {label}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════
   FULL TEMPLATES PAGE CLIENT
════════════════════════════════════════════════════════════════ */
export function TemplatesPageClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [style, setStyle] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchC = category === "All" || t.category === category.toLowerCase();
      const matchS = style === "All" || t.style.toLowerCase().includes(style.toLowerCase());
      return matchQ && matchC && matchS;
    });
  }, [query, category, style]);

  const hasFilter = category !== "All" || style !== "All" || query.trim() !== "";
  const sr = useScrollReveal({ threshold: 0.04 });

  const delays = ["", "sr-delay-100", "sr-delay-200", "sr-delay-150", "sr-delay-250", "sr-delay-300",
                  "sr-delay-100", "sr-delay-200", "sr-delay-150", "sr-delay-300", "sr-delay-100", "sr-delay-200"];

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          CINEMATIC DARK HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-navy-dark pt-32 pb-28 md:pt-44 md:pb-36">

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }}
          aria-hidden />

        {/* Gold orb top-right */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[680px] w-[680px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,155,60,0.22) 0%, rgba(200,155,60,0.06) 45%, transparent 70%)", filter: "blur(48px)" }}
          aria-hidden />

        {/* Purple orb bottom-left */}
        <div className="pointer-events-none absolute -left-28 bottom-0 h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(155,122,203,0.14) 0%, transparent 65%)", filter: "blur(70px)" }}
          aria-hidden />

        {/* Rose orb centre-bottom */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[260px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(232,140,155,0.08) 0%, transparent 65%)", filter: "blur(50px)" }}
          aria-hidden />

        <div className="container-shell relative">

          {/* Eyebrow row */}
          <div className="animate-fade-up flex items-center gap-3">
            <Badge tone="navy">Templates</Badge>
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold/55">
              <Sparkles className="h-3 w-3 animate-pulse text-gold" aria-hidden />
              {templates.length} designs
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-7 max-w-4xl font-display font-semibold text-ivory leading-[1.06] tracking-tight animate-fade-up text-balance"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)", animationDelay: "100ms" }}
          >
            Beautiful Templates{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold">for Every</span>
              <span
                className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full"
                style={{ background: "linear-gradient(90deg, #c89b3c 0%, #e0c584 60%, transparent 100%)", opacity: 0.45 }}
                aria-hidden
              />
            </span>{" "}Occasion.
          </h1>

          {/* Sub-copy */}
          <p
            className="mt-7 max-w-2xl text-[1.15rem] leading-[1.8] text-ivory/60 text-pretty animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            Start from a beautifully crafted design and make it yours — every template adapts to your{" "}
            <span className="font-medium text-ivory/85">colours, words and celebration.</span>
          </p>

          {/* Glass stats bar */}
          <div
            className="mt-10 inline-flex items-stretch gap-0 rounded-2xl border border-ivory/10 bg-white/5
              backdrop-blur-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)] animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            {[
              { value: String(templates.length), label: "Templates" },
              { value: String(templateCategories.length - 1), label: "Categories" },
              { value: String(templateStyles.length - 1), label: "Styles" },
              { value: "Free", label: "To Start" },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex items-center">
                <div className="px-7 py-4 flex flex-col items-center gap-1">
                  <HeroStat value={s.value} label={s.label} />
                </div>
                {i < arr.length - 1 && (
                  <span className="h-10 w-px bg-gradient-to-b from-transparent via-ivory/15 to-transparent" aria-hidden />
                )}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "340ms" }}>
            <Link
              href="/create-event"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden
                rounded-2xl bg-gold px-9 py-4 font-bold text-lg text-navy-dark
                shadow-[0_0_28px_rgba(200,155,60,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
                hover:bg-gold-light hover:-translate-y-1 hover:shadow-[0_0_52px_rgba(200,155,60,0.7)]
                transition-all duration-300"
            >
              <span
                className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%]
                  group-hover:translate-x-[110%] transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
                aria-hidden
              />
              Start Free
              <Zap className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="#explorer" className="inline-flex items-center gap-2 text-sm font-semibold text-ivory/55 hover:text-gold-light transition-colors duration-200">
              Browse all templates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Category preview chips */}
          <div className="mt-12 flex flex-wrap gap-2.5 animate-fade-up" style={{ animationDelay: "420ms" }}>
            {templateCategories.filter(c => c !== "All").map((cat) => {
              const { tag } = accent(cat.toLowerCase());
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold
                    transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md ${tag}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          EXPLORER — STICKY SEARCH + FILTERS + GRID
      ══════════════════════════════════════════════════════════ */}
      <section id="explorer" className="bg-ivory">

        {/* Sticky filter bar */}
        <div className="sticky top-[72px] z-30 border-b border-navy/8 bg-ivory/96 backdrop-blur-lg shadow-[0_2px_20px_rgba(23,32,51,0.05)]">
          <div className="container-shell py-4">

            {/* Row 1: search + toggle */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mutedText" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search templates…"
                  aria-label="Search templates"
                  className="w-full rounded-xl border border-navy/15 bg-warmWhite py-2.5 pl-11 pr-4 text-sm
                    outline-none transition-colors focus:border-gold placeholder:text-mutedText/70"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mutedText hover:text-navy transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filter toggle button */}
              <button
                type="button"
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-250
                  ${showFilters ? "bg-navy text-ivory border-navy" : "border-navy/15 text-navy/65 hover:border-gold/40 hover:text-navy"}`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasFilter && !showFilters && (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" aria-hidden />
                )}
              </button>

              {/* Result count */}
              <span className="hidden sm:block text-xs font-semibold text-mutedText">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>

              {/* Clear all */}
              {hasFilter && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setCategory("All"); setStyle("All"); }}
                  className="text-xs font-bold text-gold hover:text-gold-dark transition-colors"
                >
                  Clear ×
                </button>
              )}
            </div>

            {/* Row 2: filter pills (collapsible) */}
            {showFilters && (
              <div className="mt-4 flex flex-col gap-3 pb-1">
                {/* Category */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-mutedText w-16 shrink-0">Category</span>
                  <div className="flex flex-wrap gap-2">
                    {templateCategories.map((cat) => (
                      <CategoryPill key={cat} label={cat} active={category === cat} onClick={() => setCategory(cat)} />
                    ))}
                  </div>
                </div>
                {/* Style */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-mutedText w-16 shrink-0">Style</span>
                  <div className="flex flex-wrap gap-2">
                    {templateStyles.map((s) => (
                      <CategoryPill key={s} label={s} active={style === s} onClick={() => setStyle(s)} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="container-shell section-pad">
          {filtered.length > 0 ? (
            <div ref={sr.ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((template, i) => (
                <div key={template.id} className={`sr-rise ${delays[i] ?? ""} ${sr.visible ? "sr-visible" : ""}`}>
                  <TemplateCard template={template} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-28 text-center">
              <span className="text-4xl" aria-hidden>🎨</span>
              <p className="font-display text-xl font-semibold text-navy">No templates found</p>
              <p className="text-mutedText text-sm max-w-xs">Try a different category or search term.</p>
              <button
                type="button"
                onClick={() => { setQuery(""); setCategory("All"); setStyle("All"); }}
                className="mt-2 rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-navy-dark py-28">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(200,155,60,0.6) 0%, transparent 65%)", filter: "blur(60px)" }} aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }} aria-hidden />

        <div className="container-shell relative z-10 text-center">
          <Badge tone="navy" className="mb-6">Ready to start?</Badge>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold text-ivory leading-[1.1] text-balance">
            Your perfect event page is{" "}
            <span className="text-gradient-gold">one template away.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ivory/60 text-pretty">
            Pick a template, customise it in minutes, and share your event with the world.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/create-event"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gold px-9 py-4
                font-bold text-lg text-navy-dark shadow-[0_0_32px_rgba(200,155,60,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
                hover:bg-gold-light hover:-translate-y-1 hover:shadow-[0_0_56px_rgba(200,155,60,0.7)] transition-all duration-300"
            >
              <span className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%]
                group-hover:translate-x-[110%] transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }} aria-hidden />
              Create Your Event
            </Link>
            <Link href="/e/aarav-ananya-wedding"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-ivory/25 bg-white/5
                backdrop-blur-md px-9 py-4 font-bold text-lg text-ivory
                hover:border-ivory/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              See a Demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50">
            {["No credit card", "Free forever plan", "Live in 2 minutes", "50+ templates"].map(item => (
              <span key={item} className="flex items-center gap-2 text-sm font-semibold text-ivory">
                <CheckCircle2 className="h-4 w-4 text-gold" />{item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
