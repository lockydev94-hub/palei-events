"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { solutions } from "@/data/solutions";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { useState } from "react";
import type { Solution } from "@/data/solutions";

const audienceEmoji: Record<string, string> = {
  individuals: "💍",
  photographers: "📸",
  "event-planners": "🗓️",
  companies: "🏢",
  schools: "🏫",
  colleges: "🎓",
  institutions: "🏛️",
};

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-display text-2xl font-bold text-gold-light leading-none tracking-tight">
        {value}
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ivory/40">
        {label}
      </span>
    </div>
  );
}

function AudienceTab({
  solution,
  active,
  onClick,
}: {
  solution: Solution;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
        active
          ? "bg-gold text-navy-dark shadow-[0_0_20px_rgba(200,155,60,0.5)]"
          : "text-navy/55 hover:text-navy/90 hover:bg-navy/5"
      }`}
    >
      <span>{audienceEmoji[solution.id] ?? "✦"}</span>
      {solution.audience.replace("For ", "")}
    </button>
  );
}

function AudienceTabs() {
  const [active, setActive] = useState(solutions[0].id);
  const scrollTo = (id: string) => {
    setActive(id);
    const el = document.getElementById(`sol-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="sticky top-[72px] z-30 border-b border-navy/8 bg-ivory/95 backdrop-blur-lg shadow-[0_2px_20px_rgba(23,32,51,0.05)]">
      <div className="container-shell overflow-x-auto">
        <div className="flex items-center gap-1 py-2.5">
          {solutions.map((s) => (
            <AudienceTab key={s.id} solution={s} active={active === s.id} onClick={() => scrollTo(s.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SolutionDetailCard({
  solution,
  reverse,
  index,
}: {
  solution: Solution;
  reverse: boolean;
  index: number;
}) {
  const sr = useScrollReveal({ threshold: 0.1 });
  return (
    <div ref={sr.ref} className={`sr-fade-up ${sr.visible ? "sr-visible" : ""}`} style={{ transitionDelay: "60ms" }}>
      <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/10 border border-gold/25 text-xl">
              {audienceEmoji[solution.id] ?? "✦"}
            </span>
            <Badge tone="gold">{solution.audience}</Badge>
          </div>
          <h2 className="mt-6 font-display text-[clamp(1.9rem,3vw,2.6rem)] font-semibold text-navy leading-[1.1] text-balance">
            {solution.title}
          </h2>
          <p className="mt-5 text-lg leading-[1.75] text-mutedText text-pretty">
            {solution.description}
          </p>
          <ul className="mt-8 space-y-3.5">
            {solution.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3.5 text-navy/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold" aria-hidden />
                </span>
                <span className="text-[15px] leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2">
            {solution.features.map((feature) => (
              <span
                key={feature}
                className="flex items-center gap-1.5 rounded-full border border-gold/20 bg-champagne/40 px-4 py-1.5 text-xs font-bold text-gold-dark uppercase tracking-[0.1em] hover:border-gold/50 hover:bg-champagne/70 transition-all duration-200 cursor-default"
              >
                <Sparkles className="h-3 w-3" />
                {feature}
              </span>
            ))}
          </div>
          <Link
            href="/create-event"
            className="group mt-9 inline-flex items-center gap-2.5 rounded-2xl border border-navy/20 bg-navy px-7 py-3.5 text-sm font-bold text-ivory shadow-soft hover:bg-navy-dark hover:border-gold/30 hover:shadow-[0_0_24px_rgba(200,155,60,0.15)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Get started free
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative">
          <div className="group relative overflow-hidden rounded-3xl border border-navy/10 shadow-[0_32px_80px_rgba(23,32,51,0.12)]">
            <Image
              src={solution.image}
              alt={solution.audience}
              width={800}
              height={600}
              unoptimized
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-navy-dark/80 backdrop-blur-md px-4 py-2 text-xs font-bold text-ivory/90">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                {solution.audience}
              </div>
              <div className="rounded-full border border-white/10 bg-navy-dark/70 backdrop-blur-md px-4 py-2 text-xs font-semibold text-ivory/60">
                {solution.features.length} features
              </div>
            </div>
          </div>
          <div
            className={`pointer-events-none absolute -z-10 h-52 w-52 rounded-full opacity-40 ${reverse ? "-top-10 -right-10" : "-bottom-10 -left-10"}`}
            style={{ background: "radial-gradient(circle, rgba(200,155,60,0.35) 0%, transparent 70%)", filter: "blur(40px)" }}
            aria-hidden
          />
          <div
            className="absolute -top-5 -right-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold text-navy-dark font-display text-xl font-bold shadow-[0_0_20px_rgba(200,155,60,0.4)]"
            aria-hidden
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinalCTA() {
  const sr = useScrollReveal({ threshold: 0.2 });
  return (
    <section ref={sr.ref} className={`relative overflow-hidden bg-navy-dark py-28 sr-fade-up ${sr.visible ? "sr-visible" : ""}`}>
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(200,155,60,0.6) 0%, transparent 65%)", filter: "blur(60px)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }}
        aria-hidden
      />
      <div className="container-shell relative z-10 text-center">
        <Badge tone="navy" className="mb-6">Ready to get started?</Badge>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold text-ivory leading-[1.1] text-balance">
          Not sure which solution fits?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ivory/60 text-pretty">
          Tell us about your event and we&rsquo;ll help you pick the right solution — no commitment required.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gold px-9 py-4 font-bold text-lg text-navy-dark shadow-[0_0_32px_rgba(200,155,60,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-gold-light hover:-translate-y-1 hover:shadow-[0_0_56px_rgba(200,155,60,0.7)] transition-all duration-300"
          >
            <span
              className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
              aria-hidden
            />
            Talk to us
          </Link>
          <Link
            href="/create-event"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-ivory/25 bg-white/5 backdrop-blur-md px-9 py-4 font-bold text-lg text-ivory hover:border-ivory/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
          >
            Create an Event
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50">
          {["No credit card", "Free forever plan", "Live in 2 minutes", "50+ templates"].map((item) => (
            <span key={item} className="flex items-center gap-2 text-sm font-semibold text-ivory">
              <CheckCircle2 className="h-4 w-4 text-gold" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SolutionsPageClient() {
  return (
    <>
      {/* ══ DARK HERO ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-navy-dark pt-32 pb-24 md:pt-44 md:pb-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-48 -top-48 h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,155,60,0.18) 0%, rgba(200,155,60,0.06) 45%, transparent 70%)", filter: "blur(40px)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(155,122,203,0.12) 0%, transparent 65%)", filter: "blur(60px)" }}
          aria-hidden
        />
        <div className="container-shell relative">
          <div className="animate-fade-up flex items-center gap-3">
<div className="mb-6">
              <Breadcrumb
                light
                items={[
                  { label: "Home", href: "/" },
                  { label: "Solutions" },
                ]}
              />
            </div>
            <Badge tone="navy">Solutions</Badge>
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold/60">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />7 solutions
            </span>
          </div>
          <h1
            className="mt-7 max-w-4xl font-display font-semibold text-ivory leading-[1.06] tracking-tight animate-fade-up text-balance"
            style={{ fontSize: "clamp(2.6rem, 5.2vw, 4.5rem)", animationDelay: "100ms" }}
          >
            Built for the{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold">people behind</span>
              <span
                className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full"
                style={{ background: "linear-gradient(90deg, #c89b3c 0%, #e0c584 60%, transparent 100%)", opacity: 0.45 }}
                aria-hidden
              />
            </span>{" "}
            every event
          </h1>
          <p
            className="mt-7 max-w-2xl text-[1.18rem] leading-[1.75] text-ivory/60 text-pretty animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            One platform that scales from a single celebration to a large
            organisation&rsquo;s entire event calendar —{" "}
            <span className="text-ivory/85 font-medium">tailored to the way you work.</span>
          </p>
          <div
            className="mt-10 inline-flex items-center gap-8 rounded-2xl border border-ivory/8 bg-white/5 backdrop-blur-md px-7 py-4 animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            <HeroStat value="7" label="Solutions" />
            <span className="h-10 w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent" />
            <HeroStat value="10K+" label="Events" />
            <span className="h-10 w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent" />
            <HeroStat value="50+" label="Templates" />
          </div>
          <div
            className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up"
            style={{ animationDelay: "340ms" }}
          >
            <Link
              href="/create-event"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gold px-9 py-4 font-bold text-lg text-navy-dark shadow-[0_0_28px_rgba(200,155,60,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-gold-light hover:-translate-y-1 hover:shadow-[0_0_52px_rgba(200,155,60,0.7)] transition-all duration-300"
            >
              <span
                className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
                aria-hidden
              />
              Start for free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ivory/65 hover:text-gold-light transition-colors duration-200"
            >
              Talk to sales <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div
            className="mt-12 flex flex-wrap gap-2.5 animate-fade-up"
            style={{ animationDelay: "420ms" }}
          >
            {solutions.map((s) => (
              <a
                key={s.id}
                href={`#sol-${s.id}`}
                className="flex items-center gap-2 rounded-full border border-ivory/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-ivory/55 hover:border-gold/30 hover:bg-gold/10 hover:text-ivory/90 transition-all duration-200"
              >
                {audienceEmoji[s.id]} {s.audience.replace("For ", "")}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STICKY TABS ════════════════════════════════════════════════════ */}
      <AudienceTabs />

      {/* ══ DETAIL SECTIONS ═════════════════════════════════════════════════ */}
      <div>
        {solutions.map((solution, index) => (
          <section
            key={solution.id}
            id={`sol-${solution.id}`}
            className={`section-pad scroll-mt-28 ${index % 2 === 0 ? "bg-ivory" : "bg-warmWhite"}`}
          >
            <div className="container-shell">
              <SolutionDetailCard solution={solution} reverse={index % 2 === 1} index={index} />
            </div>
          </section>
        ))}
      </div>

      {/* ══ FINAL CTA ══════════════════════════════════════════════════════ */}
      <FinalCTA />
    </>
  );
}
