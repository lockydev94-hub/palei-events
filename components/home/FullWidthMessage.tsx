"use client";

import { FullWidthAnimatedSection } from "@/components/animation/FullWidthAnimation";
import { Button } from "@/components/ui/Button";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: "10K+", label: "Events created" },
  { value: "98%",  label: "Guest satisfaction" },
  { value: "50+",  label: "Templates" },
];

const pillFeatures = [
  {
    label: "Beautiful event pages",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <path d="M8 1l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 9.8 4.3 12.5l1.4-4.3L2 5.5h4.5L8 1z"/>
      </svg>
    ),
  },
  {
    label: "Live guest memories",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <rect x="1" y="3" width="14" height="10" rx="1.5"/>
        <circle cx="6" cy="7.5" r="1.5"/>
        <path d="M9 6.5l4 4H1.5l3-3 1.5 1.5"/>
      </svg>
    ),
  },
  {
    label: "Instant invitations",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <path d="M14 2L7 9"/>
        <path d="M14 2L9.5 14 7 9 2 6.5 14 2z"/>
      </svg>
    ),
  },
];

export function FullWidthMessage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay: number) => ({
    transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
  });

  return (
    <FullWidthAnimatedSection
      animationKey="odishaGolden"
      overlay="dark"
      overlayOpacity={0.74}
      minHeight="min-h-[80vh]"
    >
      <div ref={sectionRef} className="max-w-2xl py-20 lg:py-28">

        {/* ── Eyebrow line ─────────────────────────────────── */}
        <div className="flex items-center gap-3" style={anim(0)}>
          <span
            className="block h-px w-10 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(200,155,60,0.7))" }}
          />
          <p
            className="text-[10px] font-bold uppercase tracking-[0.32em]"
            style={{ color: "#c89b3c" }}
          >
            Beyond the invitation
          </p>
        </div>

        {/* ── Headline ─────────────────────────────────────── */}
        <h2
          className="mt-5 font-display font-semibold text-ivory leading-[1.1] tracking-tight text-balance"
          style={{
            ...anim(100),
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
          }}
        >
          Your event deserves more{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #e8d5a8 0%, #c89b3c 55%, #f0d080 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            than a link.
          </span>
        </h2>

        {/* ── Feature pills ────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap gap-2" style={anim(180)}>
          {pillFeatures.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
              style={{
                background: "rgba(200,155,60,0.10)",
                border: "1px solid rgba(200,155,60,0.22)",
                color: "#e8d5a8",
              }}
            >
              <span style={{ color: "#c89b3c" }}>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>

        {/* ── Body copy ────────────────────────────────────── */}
        <p
          className="mt-6 max-w-xl text-lg leading-relaxed"
          style={{ ...anim(240), color: "rgba(255,253,248,0.72)" }}
        >
          A Palei event page becomes the{" "}
          <span style={{ color: "#e8d5a8", fontWeight: 600 }}>
            heart of your celebration
          </span>{" "}
          — the place where schedules, moments and memories of everyone who came
          together, live on.
        </p>

        {/* ── CTA row ──────────────────────────────────────── */}
        <div className="mt-9 flex flex-wrap items-center gap-4" style={anim(320)}>
          <Button href="/create-event" variant="secondary" size="lg">
            Create Your Event
          </Button>
          <a
            href="/templates"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-90"
            style={{ color: "rgba(232,213,168,0.65)" }}
          >
            Browse templates
            <svg
              viewBox="0 0 14 14" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M2 7h10M8 3l4 4-4 4"/>
            </svg>
          </a>
        </div>

        {/* ── Divider ──────────────────────────────────────── */}
        <div
          className="mt-12 h-px max-w-xs rounded-full"
          style={{
            ...anim(400),
            background: "linear-gradient(90deg, rgba(200,155,60,0.40), transparent)",
          }}
        />

        {/* ── Stats row ────────────────────────────────────── */}
        <div className="mt-7 flex flex-wrap gap-8" style={anim(460)}>
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span
                className="font-display text-3xl font-bold leading-none"
                style={{
                  background: "linear-gradient(135deg, #e8d5a8, #c89b3c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animationDelay: `${460 + i * 60}ms`,
                }}
              >
                {s.value}
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "rgba(255,253,248,0.38)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </FullWidthAnimatedSection>
  );
}
