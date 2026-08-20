"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { eventTypeMeta } from "@/data/events";
import { templates } from "@/data/templates";
import { pricingPlans } from "@/data/pricing";
import { Icon } from "@/components/ui/Icon";

/* ─── types ─────────────────────────────────────────────────── */
type EventTypeKey = keyof typeof eventTypeMeta;

/* ─── data ───────────────────────────────────────────────────── */
const EVENT_TYPES: { key: EventTypeKey; emoji: string }[] = [
  { key: "wedding",     emoji: "💍" },
  { key: "birthday",    emoji: "🎂" },
  { key: "corporate",   emoji: "🏢" },
  { key: "school",      emoji: "🎓" },
  { key: "college",     emoji: "🎪" },
  { key: "government",  emoji: "🏛️" },
  { key: "conference",  emoji: "🎙️" },
  { key: "cultural",    emoji: "🎭" },
  { key: "sports",      emoji: "🏆" },
  { key: "community",   emoji: "🤝" },
];

const WHAT_YOU_GET = [
  { icon: "globe",    title: "Beautiful Event Page",  desc: "Mobile-ready, shareable, and styled to match your occasion." },
  { icon: "check",    title: "RSVP Management",       desc: "Collect responses, guest counts, and dietary preferences." },
  { icon: "qr",       title: "QR Code Invite",        desc: "Print or share a scannable code — guests arrive ready." },
  { icon: "image",    title: "Photo Gallery",          desc: "Crowd-source memories from every guest who attends." },
  { icon: "calendar", title: "Event Schedule",         desc: "A clear programme so guests always know what's next." },
  { icon: "bell",     title: "Live Updates",           desc: "Push real-time announcements the moment plans change." },
];

const DEMO_EVENTS = [
  { label: "Wedding Demo",      href: "/e/aarav-ananya-wedding",                       image: "/full-width-animation/PE-BG-01-golden-odisha.gif",           type: "💍 Wedding" },
  { label: "Corporate Summit",  href: "/e/odisha-business-summit-2026",                image: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif", type: "🏢 Corporate" },
  { label: "College Fest",      href: "/e/bhubaneswar-youth-fest",                     image: "/animation/Floating Confetti.gif",                           type: "🎪 College" },
  { label: "Kids Birthday",     href: "/e/aarav-turns-eight",                          image: "/animation/Floating Floral Petals.gif",                      type: "🎂 Birthday" },
  { label: "School Annual Day", href: "/e/dav-annual-cultural-2026",                   image: "/animation/Odisha Sambalpuri Pattern Motion.gif",            type: "🎓 School" },
  { label: "Community Conf.",   href: "/e/odisha-community-development-conference-2026", image: "/animation/Elegant Light Sweep.gif",                       type: "🤝 Community" },
];

const STEPS = [
  { num: "01", icon: "sparkles", title: "Choose your event type",   desc: "Wedding, birthday, corporate, school, college, cultural and more — pick what fits your celebration." },
  { num: "02", icon: "palette",  title: "Pick a template",          desc: "Browse 50+ beautiful templates designed for each event type. Start from a curated layout, not a blank page." },
  { num: "03", icon: "globe",    title: "Add your details",         desc: "Event name, date, venue, photos and description. The live preview updates as you type." },
  { num: "04", icon: "qr",       title: "Publish & share",          desc: "Hit Publish. Your page goes live with a shareable link and QR code — ready for your guests." },
];

/* ─── small shared atoms ─────────────────────────────────────── */
function GoldPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em]"
      style={{
        background: "rgba(200,155,60,0.12)",
        border: "1px solid rgba(200,155,60,0.3)",
        color: "#c89b3c",
      }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      <span className="h-px w-8" style={{ background: "rgba(200,155,60,0.35)" }} />
      <GoldPill>{children}</GoldPill>
      <span className="h-px w-8" style={{ background: "rgba(200,155,60,0.35)" }} />
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────── */
export function CreateEventPageClient() {
  const [selected, setSelected] = useState<EventTypeKey | null>(null);

  const selectedMeta   = selected ? eventTypeMeta[selected] : null;
  const selectedEmoji  = selected ? EVENT_TYPES.find((e) => e.key === selected)?.emoji : null;
  const relatedTemplates = selected
    ? templates.filter((t) => t.category === selected).slice(0, 3)
    : templates.filter((t) => t.featured).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: "#faf8f3" }}>

      {/* ═══════════════════════════════════════════════════════
          HERO — dark navy with animated texture
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32"
        style={{ background: "linear-gradient(160deg, #0f1522 0%, #172033 55%, #1a2440 100%)" }}
      >
        {/* dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
          aria-hidden
        />
        {/* gold glow top-right */}
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full"
          style={{ background: "rgba(200,155,60,0.12)", filter: "blur(100px)" }}
          aria-hidden
        />
        {/* gold glow bottom-left */}
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full"
          style={{ background: "rgba(200,155,60,0.07)", filter: "blur(80px)" }}
          aria-hidden
        />

        <div className="container-shell relative text-center">
          <div className="animate-fade-up">
            <GoldPill>✦ Start creating</GoldPill>
          </div>

          <h1
            className="mt-7 font-display font-semibold text-ivory leading-[1.07] tracking-tight animate-fade-up"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)", animationDelay: "80ms" }}
          >
            Your event, beautifully live
            <br />
            <span
              style={{
                background: "linear-gradient(110deg, #e0c584 0%, #c89b3c 45%, #f5dfa0 80%, #e0c584 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmerGold 4s linear infinite",
              }}
            >
              in minutes.
            </span>
          </h1>

          <p
            className="mt-7 mx-auto max-w-xl text-[1.1rem] leading-[1.8] text-ivory/65 animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            Pick your event type below, choose a template, add your details, and share a link
            or QR code — your guests are in before you know it.
          </p>

          {/* quick stat strip */}
          <div
            className="mt-11 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            {[
              { v: "Free", l: "to start" },
              { v: "10K+", l: "events created" },
              { v: "50+", l: "templates" },
              { v: "5 min", l: "to go live" },
            ].map(({ v, l }) => (
              <div
                key={v}
                className="flex items-center gap-2 rounded-xl px-5 py-3"
                style={{
                  background: "rgba(255,253,248,0.05)",
                  border: "1px solid rgba(200,155,60,0.18)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="font-display font-bold text-gold-light text-lg leading-none">{v}</span>
                <span className="text-[0.72rem] uppercase tracking-[0.14em] text-ivory/40">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STEP 1 — CHOOSE EVENT TYPE
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: "#faf8f3" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Step 1 of 4</SectionLabel>
            <h2 className="font-display text-[1.9rem] font-semibold text-navy leading-snug">
              What are you celebrating?
            </h2>
            <p className="mt-3 text-mutedText text-[1rem] max-w-md mx-auto">
              Choose your event type to see matching templates and features.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {EVENT_TYPES.map(({ key, emoji }) => {
              const meta = eventTypeMeta[key];
              const isActive = selected === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(isActive ? null : key)}
                  className="group relative flex flex-col items-center gap-2.5 rounded-2xl px-3 py-5 text-center transition-all duration-300 ease-out hover:-translate-y-1"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(200,155,60,0.15) 0%, rgba(200,155,60,0.06) 100%)"
                      : "rgba(255,253,248,0.8)",
                    border: isActive ? "1px solid rgba(200,155,60,0.5)" : "1px solid rgba(23,32,51,0.1)",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(200,155,60,0.15), 0 8px 24px rgba(23,32,51,0.06)"
                      : "0 2px 12px rgba(23,32,51,0.04)",
                  }}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <span
                      className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full flex items-center justify-center"
                      style={{ background: "#c89b3c" }}
                    >
                      <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </span>
                  )}
                  <span className="text-3xl">{emoji}</span>
                  <span
                    className="font-semibold text-[0.8rem] leading-tight"
                    style={{ color: isActive ? "#a67f2e" : "#172033" }}
                  >
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* contextual description when selected */}
          {selectedMeta && (
            <div
              className="mt-6 rounded-2xl px-6 py-5 flex items-start gap-4"
              style={{
                background: "linear-gradient(135deg, rgba(200,155,60,0.08) 0%, rgba(200,155,60,0.03) 100%)",
                border: "1px solid rgba(200,155,60,0.22)",
              }}
            >
              <span className="text-3xl mt-0.5">{selectedEmoji}</span>
              <div>
                <p className="font-semibold text-navy">{selectedMeta.label} events</p>
                <p className="text-sm text-mutedText mt-0.5">{selectedMeta.description}</p>
              </div>
              <span className="ml-auto text-xs text-gold-dark font-semibold shrink-0 pt-1">
                Templates below ↓
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STEP 2 — TEMPLATE PREVIEW (context-aware)
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-6"
        style={{ background: "linear-gradient(180deg, #f3f1ec 0%, #faf8f3 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Step 2 of 4</SectionLabel>
            <h2 className="font-display text-[1.9rem] font-semibold text-navy leading-snug">
              {selected
                ? `${selectedMeta?.label} templates`
                : "Pick a template to start from"}
            </h2>
            <p className="mt-3 text-mutedText text-[1rem] max-w-md mx-auto">
              {selected
                ? `${relatedTemplates.length} template${relatedTemplates.length !== 1 ? "s" : ""} available for ${selectedMeta?.label} events. Every one adapts to your colours and words.`
                : "Select an event type above to filter templates, or browse featured designs below."}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="group relative overflow-hidden rounded-2xl"
                style={{
                  border: "1px solid rgba(23,32,51,0.1)",
                  boxShadow: "0 4px 20px rgba(23,32,51,0.06)",
                }}
              >
                {/* preview image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <Image
                    src={tmpl.preview}
                    alt={tmpl.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, transparent 50%, rgba(10,15,28,0.75) 100%)" }}
                  />
                  {tmpl.featured && (
                    <span
                      className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em]"
                      style={{ background: "rgba(200,155,60,0.9)", color: "#0f1522" }}
                    >
                      ✦ Featured
                    </span>
                  )}
                  {/* overlay CTA on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {tmpl.demoSlug ? (
                      <Link
                        href={`/e/${tmpl.demoSlug}`}
                        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-navy-dark transition-all"
                        style={{
                          background: "linear-gradient(135deg, #e0c584, #c89b3c)",
                          boxShadow: "0 0 24px rgba(200,155,60,0.5)",
                        }}
                      >
                        Preview template →
                      </Link>
                    ) : (
                      <span
                        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-ivory"
                        style={{ background: "rgba(10,15,28,0.7)", backdropFilter: "blur(8px)" }}
                      >
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>

                {/* card body */}
                <div
                  className="px-5 py-4"
                  style={{ background: "rgba(255,253,248,0.95)" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy text-[0.9rem]">{tmpl.name}</p>
                      <p className="text-[0.72rem] text-gold-dark font-medium mt-0.5">{tmpl.style}</p>
                    </div>
                    {tmpl.demoSlug && (
                      <Link
                        href={`/e/${tmpl.demoSlug}`}
                        className="shrink-0 text-xs font-semibold text-gold-dark hover:text-gold transition-colors mt-0.5"
                      >
                        Preview →
                      </Link>
                    )}
                  </div>
                  <p className="text-[0.8rem] text-mutedText mt-2 leading-snug">{tmpl.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-dark hover:text-gold transition-colors group"
            >
              Browse all 50+ templates
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS — 4 steps visual
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0f1522 0%, #172033 60%, #1a2440 100%)" }}
      >
        {/* bg texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,155,60,0.07), transparent 70%)" }}
          aria-hidden
        />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="font-display text-[1.9rem] font-semibold text-ivory leading-snug mt-2">
              From idea to{" "}
              <span style={{
                background: "linear-gradient(110deg, #e0c584, #c89b3c, #f5dfa0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>live event page</span>
            </h2>
            <p className="mt-4 text-ivory/55 max-w-md mx-auto">
              Four simple steps. No design skills needed. Average time to publish: 8 minutes.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className="relative rounded-2xl p-6 flex flex-col gap-4 group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,253,248,0.04)",
                  border: "1px solid rgba(255,253,248,0.08)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute right-0 top-10 h-px w-5 translate-x-full hidden lg:block"
                    style={{ background: "linear-gradient(90deg, rgba(200,155,60,0.5), transparent)" }}
                    aria-hidden
                  />
                )}
                {/* step number */}
                <span
                  className="font-display text-5xl font-bold leading-none select-none"
                  style={{ color: "rgba(200,155,60,0.15)" }}
                  aria-hidden
                >
                  {s.num}
                </span>
                {/* icon */}
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-gold-light transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "rgba(200,155,60,0.12)",
                    border: "1px solid rgba(200,155,60,0.2)",
                  }}
                >
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-ivory text-[0.95rem]">{s.title}</p>
                  <p className="text-[0.82rem] text-ivory/50 leading-relaxed mt-1.5">{s.desc}</p>
                </div>
                {/* bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full"
                  style={{ background: "linear-gradient(90deg, #c89b3c, transparent)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHAT YOU GET — feature grid
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: "#faf8f3" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>What's included</SectionLabel>
            <h2 className="font-display text-[1.9rem] font-semibold text-navy leading-snug">
              Everything your event needs
            </h2>
            <p className="mt-3 text-mutedText max-w-md mx-auto">
              Every Palei event page comes loaded with the features that make celebrations easier to share and remember.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_YOU_GET.map((f) => (
              <div
                key={f.title}
                className="group flex gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,253,248,0.9)",
                  border: "1px solid rgba(23,32,51,0.09)",
                  boxShadow: "0 2px 16px rgba(23,32,51,0.04)",
                }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gold transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, rgba(200,155,60,0.12), rgba(200,155,60,0.05))",
                    border: "1px solid rgba(200,155,60,0.2)",
                  }}
                >
                  <Icon name={f.icon} className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="font-semibold text-navy text-[0.9rem]">{f.title}</p>
                  <p className="text-[0.8rem] text-mutedText leading-snug mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          LIVE DEMO EVENTS — preview gallery
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-6"
        style={{ background: "linear-gradient(180deg, #f0ede6 0%, #faf8f3 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>See it live</SectionLabel>
            <h2 className="font-display text-[1.9rem] font-semibold text-navy leading-snug">
              Explore real event pages
            </h2>
            <p className="mt-3 text-mutedText max-w-md mx-auto">
              Click any demo to experience what your guests will see — on any device, instantly.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_EVENTS.map((demo) => (
              <Link
                key={demo.href}
                href={demo.href}
                className="group relative overflow-hidden rounded-2xl block transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  boxShadow: "0 4px 24px rgba(23,32,51,0.08)",
                  border: "1px solid rgba(23,32,51,0.09)",
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <Image
                    src={demo.image}
                    alt={demo.label}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, transparent 35%, rgba(10,15,28,0.82) 100%)" }}
                  />
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <span
                      className="text-[0.62rem] font-bold uppercase tracking-[0.18em] rounded-full px-2.5 py-1 mb-2 inline-block"
                      style={{ background: "rgba(200,155,60,0.85)", color: "#0f1522" }}
                    >
                      {demo.type}
                    </span>
                    <p className="font-display font-semibold text-ivory text-lg leading-tight">{demo.label}</p>
                  </div>
                  {/* hover arrow */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-navy-dark font-bold"
                      style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)" }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRICING STRIP
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: "#faf8f3" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="font-display text-[1.9rem] font-semibold text-navy leading-snug">
              Start free. Scale when you're ready.
            </h2>
            <p className="mt-3 text-mutedText max-w-md mx-auto">
              Every plan includes a beautiful event page. Upgrade only when you need more.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: plan.featured
                    ? "linear-gradient(160deg, #172033 0%, #22304d 100%)"
                    : "rgba(255,253,248,0.95)",
                  border: plan.featured
                    ? "1px solid rgba(200,155,60,0.35)"
                    : "1px solid rgba(23,32,51,0.1)",
                  boxShadow: plan.featured
                    ? "0 0 40px rgba(200,155,60,0.12), 0 8px 32px rgba(10,15,28,0.15)"
                    : "0 2px 16px rgba(23,32,51,0.05)",
                }}
              >
                {plan.featured && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)", color: "#0f1522" }}
                  >
                    Most popular
                  </span>
                )}
                <div className="mb-5">
                  <p
                    className="font-semibold text-[0.8rem] uppercase tracking-[0.14em] mb-2"
                    style={{ color: plan.featured ? "#e0c584" : "#6b7280" }}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1">
                    <span
                      className="font-display font-bold text-3xl leading-none"
                      style={{ color: plan.featured ? "#fffdf8" : "#172033" }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className="text-xs mb-1"
                        style={{ color: plan.featured ? "rgba(255,253,248,0.4)" : "#9ca3af" }}
                      >
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-[0.78rem] mt-2 leading-snug"
                    style={{ color: plan.featured ? "rgba(255,253,248,0.55)" : "#6b7280" }}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[0.8rem]">
                      <svg
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: plan.featured ? "#c89b3c" : "#c89b3c" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      <span style={{ color: plan.featured ? "rgba(255,253,248,0.7)" : "#374151" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/pricing"
                  className="mt-auto w-full flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  style={
                    plan.featured
                      ? {
                          background: "linear-gradient(135deg, #e0c584, #c89b3c)",
                          color: "#0f1522",
                          boxShadow: "0 0 24px rgba(200,155,60,0.35)",
                        }
                      : {
                          border: "1px solid rgba(23,32,51,0.18)",
                          color: "#172033",
                          background: "transparent",
                        }
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center mt-6 text-xs text-mutedText/70">
            Full pricing details and plan comparison on the{" "}
            <Link href="/pricing" className="text-gold-dark hover:text-gold underline underline-offset-2 transition-colors">
              pricing page
            </Link>.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-28 px-6 relative overflow-hidden text-center"
        style={{ background: "linear-gradient(160deg, #0f1522 0%, #172033 55%, #1a2440 100%)" }}
      >
        {/* bg texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(200,155,60,0.1), transparent 65%)" }}
          aria-hidden
        />

        <div className="max-w-2xl mx-auto relative">
          <GoldPill>✦ Ready when you are</GoldPill>
          <h2
            className="mt-6 font-display font-semibold text-ivory leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
          >
            Your event page is
            <br />
            <span style={{
              background: "linear-gradient(110deg, #e0c584 0%, #c89b3c 45%, #f5dfa0 80%, #e0c584 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmerGold 4s linear infinite",
            }}>
              waiting to be created.
            </span>
          </h2>
          <p className="mt-5 text-ivory/55 text-lg leading-relaxed max-w-md mx-auto">
            The editor launches soon. Explore a live demo event now to see exactly what your guests will experience.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/e/aarav-ananya-wedding"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-8 py-4 font-semibold text-navy-dark transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #e0c584 0%, #c89b3c 100%)",
                boxShadow: "0 0 36px rgba(200,155,60,0.45)",
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                aria-hidden
              />
              See a live wedding page
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold text-gold-light transition-all duration-300 hover:-translate-y-0.5"
              style={{
                border: "1px solid rgba(200,155,60,0.35)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
              }}
            >
              Browse all templates
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
