"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Floating sparkle SVG ─────────────────────────────────── */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
    </svg>
  );
}

/* ─── Floating orb decoration ───────────────────────────────── */
function FloatingOrb({
  size,
  x,
  y,
  delay,
  opacity,
  color,
}: {
  size: number;
  x: string;
  y: string;
  delay: number;
  opacity: number;
  color: string;
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: color,
        opacity,
        filter: "blur(60px)",
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        willChange: "transform",
      }}
      aria-hidden
    />
  );
}

/* ─── Stat pill — glassmorphic premium ──────────────────────── */
function StatPill({
  value,
  label,
  icon,
  delay = 0,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-default transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,253,248,0.07) 0%, rgba(255,253,248,0.03) 100%)",
        border: "1px solid rgba(200,155,60,0.22)",
        backdropFilter: "blur(16px)",
        boxShadow:
          "0 0 0 0.5px rgba(200,155,60,0.10) inset, 0 4px 20px rgba(0,0,0,0.15)",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* icon circle */}
      <div
        className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(200,155,60,0.22), rgba(200,155,60,0.10))",
          border: "1px solid rgba(200,155,60,0.25)",
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span
          className="font-display font-bold tracking-tight leading-none"
          style={{
            fontSize: "1.35rem",
            background:
              "linear-gradient(110deg, #f5dfa0 0%, #e0c584 50%, #c89b3c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {value}
        </span>
        <span
          className="text-[0.65rem] uppercase tracking-[0.18em] font-body mt-0.5"
          style={{ color: "rgba(255,253,248,0.42)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/* ─── Feature tag pill ───────────────────────────────────────── */
function FeatureTag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        background: "rgba(255,253,248,0.06)",
        border: "1px solid rgba(255,253,248,0.12)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span style={{ color: "#c89b3c" }}>{icon}</span>
      <span className="text-[0.72rem] font-medium" style={{ color: "rgba(255,253,248,0.70)" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Eyebrow badge ─────────────────────────────────────────── */
function EyebrowBadge() {
  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full pl-2 pr-5 py-2 animate-fade-up"
      style={{
        background:
          "linear-gradient(135deg, rgba(200,155,60,0.18) 0%, rgba(200,155,60,0.07) 100%)",
        border: "1px solid rgba(200,155,60,0.35)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 24px rgba(200,155,60,0.12)",
      }}
    >
      {/* pulse dot */}
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-25 animate-ping"
          style={{ background: "#c89b3c" }}
        />
        <span
          className="relative inline-flex h-3 w-3 rounded-full"
          style={{
            background: "linear-gradient(135deg, #f5dfa0, #c89b3c)",
            boxShadow: "0 0 8px rgba(200,155,60,0.6)",
          }}
        />
      </span>
      <span
        className="text-[0.68rem] font-semibold uppercase tracking-[0.22em]"
        style={{ color: "#e0c584" }}
      >
        Digital Event Experience Platform
      </span>
      <Sparkle className="h-3 w-3 text-gold-light/55" />
    </div>
  );
}

/* ─── Trusted avatars + social proof ───────────────────────── */
function SocialProof() {
  const avatarColors = [
    "linear-gradient(135deg,#e88c9b,#f29b7a)",
    "linear-gradient(135deg,#9b7acb,#c89b3c)",
    "linear-gradient(135deg,#e0c584,#c89b3c)",
    "linear-gradient(135deg,#93a88a,#6b9e7c)",
    "linear-gradient(135deg,#c89b3c,#a67f2e)",
  ];
  return (
    <div
      className="flex items-center gap-4 animate-fade-up"
      style={{ animationDelay: "520ms" }}
    >
      <div className="flex -space-x-2.5">
        {avatarColors.map((bg, i) => (
          <span
            key={i}
            className="h-8 w-8 rounded-full flex-shrink-0"
            style={{
              background: bg,
              border: "2px solid rgba(10,15,28,0.85)",
              boxShadow: "0 0 0 1px rgba(200,155,60,0.15)",
            }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="h-3 w-3"
              viewBox="0 0 12 12"
              fill="#e0c584"
              aria-hidden
            >
              <path d="M6 0.5l1.545 3.13 3.455.502-2.5 2.436.59 3.438L6 8.385 2.91 9.006l.59-3.438-2.5-2.436 3.455-.502z" />
            </svg>
          ))}
          <span
            className="ml-1.5 text-[0.72rem] font-semibold"
            style={{ color: "#e0c584" }}
          >
            4.9
          </span>
        </div>
        <p className="text-[0.76rem]" style={{ color: "rgba(255,253,248,0.48)" }}>
          Trusted by{" "}
          <span
            className="font-semibold"
            style={{ color: "rgba(255,253,248,0.82)" }}
          >
            10,000+ event creators
          </span>{" "}
          across India
        </p>
      </div>
    </div>
  );
}

/* ─── Animated typewriter for rotating event types ─────────── */
const EVENT_TYPES = [
  "Weddings",
  "Birthdays",
  "Corporate Events",
  "College Fests",
  "Cultural Shows",
  "School Graduations",
];

function TypewriterWord() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = EVENT_TYPES[index];
    if (!deleting && displayed.length < current.length) {
      timerRef.current = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        58
      );
    } else if (!deleting && displayed.length === current.length) {
      timerRef.current = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timerRef.current = setTimeout(
        () => setDisplayed(displayed.slice(0, -1)),
        32
      );
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % EVENT_TYPES.length);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [displayed, deleting, index]);

  return (
    <span className="inline-block relative">
      <span
        style={{
          background:
            "linear-gradient(110deg, #f5dfa0 0%, #e0c584 35%, #c89b3c 65%, #f5dfa0 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "shimmerGold 4s linear infinite",
          display: "inline",
        }}
      >
        {displayed}
      </span>
      {/* cursor */}
      <span
        className="inline-block w-[3px] ml-[2px] rounded-full"
        style={{
          height: "0.85em",
          background: "#c89b3c",
          verticalAlign: "middle",
          animation: "blink 1s step-end infinite",
          boxShadow: "0 0 8px rgba(200,155,60,0.7)",
        }}
        aria-hidden
      />
    </span>
  );
}

/* ─── Main hero content ─────────────────────────────────────── */
export function HeroContent() {
  return (
    <div className="py-36 lg:py-48 max-w-[800px]">
      {/* Floating ambient orbs — only in the content area */}
      <FloatingOrb
        size={320}
        x="-120px"
        y="-80px"
        delay={0}
        opacity={0.07}
        color="radial-gradient(circle, #c89b3c, transparent)"
      />
      <FloatingOrb
        size={240}
        x="520px"
        y="200px"
        delay={2}
        opacity={0.05}
        color="radial-gradient(circle, #9b7acb, transparent)"
      />

      {/* Eyebrow */}
      <EyebrowBadge />

      {/* Headline */}
      <h1
        className="mt-8 font-display font-semibold leading-[1.04] tracking-tight animate-fade-up"
        style={{
          fontSize: "clamp(2.9rem, 6.2vw, 5.4rem)",
          animationDelay: "80ms",
          color: "#fffdf8",
        }}
      >
        Every Event.
        <br />
        One Unforgettable
        <br />
        <TypewriterWord />
      </h1>

      {/* Divider accent */}
      <div
        className="mt-8 animate-fade-up"
        style={{
          animationDelay: "160ms",
          width: "64px",
          height: "2px",
          borderRadius: "2px",
          background:
            "linear-gradient(90deg, #e0c584, rgba(200,155,60,0.2))",
        }}
        aria-hidden
      />

      {/* Premium Sub-copy — upgraded */}
      <div
        className="mt-7 animate-fade-up"
        style={{ animationDelay: "200ms" }}
      >
        <p
          className="max-w-[560px] leading-[1.90]"
          style={{
            fontSize: "1.12rem",
            color: "rgba(255,253,248,0.68)",
            letterSpacing: "0.015em",
          }}
        >
          Design stunning event pages in minutes — share invitations, collect
          RSVPs, curate memories and bring every guest together in{" "}
          <span
            style={{
              color: "rgba(255,253,248,0.92)",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            one beautifully crafted digital experience.
          </span>
        </p>

        {/* Feature tags row */}
        <div className="mt-5 flex flex-wrap gap-2">
          <FeatureTag
            label="Instant Setup"
            icon={
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                <path d="M6 0L7.5 4.5H12L8.25 7.25L9.75 12L6 9.25L2.25 12L3.75 7.25L0 4.5H4.5L6 0Z" />
              </svg>
            }
          />
          <FeatureTag
            label="Guest RSVPs"
            icon={
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                <path d="M10 2H2C1.45 2 1 2.45 1 3V9C1 9.55 1.45 10 2 10H10C10.55 10 11 9.55 11 9V3C11 2.45 10.55 2 10 2ZM10 4L6 7L2 4V3L6 6L10 3V4Z" />
              </svg>
            }
          />
          <FeatureTag
            label="Photo Galleries"
            icon={
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                <path d="M1 1h4v4H1zM7 1h4v4H7zM1 7h4v4H1zM7 7h4v4H7z" />
              </svg>
            }
          />
          <FeatureTag
            label="Live Updates"
            icon={
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                <circle cx="6" cy="6" r="2.5" />
                <path d="M6 1v1.5M6 9.5V11M1 6h1.5M9.5 6H11M2.6 2.6l1.1 1.1M8.3 8.3l1.1 1.1M9.4 2.6L8.3 3.7M3.7 8.3L2.6 9.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            }
          />
          <FeatureTag
            label="50+ Templates"
            icon={
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                <path d="M2 2h3v3H2zM7 2h3v3H7zM2 7h3v3H2zM7 7h3v3H7z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* CTA row */}
      <div
        className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up"
        style={{ animationDelay: "280ms" }}
      >
        {/* Primary — gold with shimmer */}
        <Link
          href="/create-event"
          className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-9 py-4 font-semibold text-[1rem] transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          style={{
            background:
              "linear-gradient(135deg, #f5dfa0 0%, #e0c584 25%, #c89b3c 60%, #a67f2e 100%)",
            boxShadow:
              "0 0 40px rgba(200,155,60,0.55), 0 4px 20px rgba(0,0,0,0.28), 0 0 0 1px rgba(200,155,60,0.3) inset",
            color: "#0f1522",
          }}
        >
          {/* shimmer sweep */}
          <span
            className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-out"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)",
            }}
            aria-hidden
          />
          {/* sparkle icon */}
          <svg
            className="h-4 w-4 flex-shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden
          >
            <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
          </svg>
          Create Your Event
        </Link>

        {/* Secondary — glass pill */}
        <Link
          href="/templates"
          className="group inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 font-semibold text-[1rem] transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          style={{
            border: "1px solid rgba(200,155,60,0.38)",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(14px)",
            color: "#e0c584",
            boxShadow: "0 0 0 0.5px rgba(200,155,60,0.12) inset",
          }}
        >
          Browse Templates
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Stats row */}
      <div
        className="mt-12 flex flex-wrap items-center gap-3 animate-fade-up"
        style={{ animationDelay: "380ms" }}
      >
        <StatPill
          value="10K+"
          label="Events Created"
          delay={0}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="#e0c584" aria-hidden>
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
          }
        />
        <StatPill
          value="98%"
          label="Satisfaction"
          delay={60}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="#e0c584" aria-hidden>
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatPill
          value="50+"
          label="Templates"
          delay={120}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="#e0c584" aria-hidden>
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          }
        />
      </div>

      {/* Social proof */}
      <div
        className="mt-8 animate-fade-up"
        style={{ animationDelay: "460ms" }}
      >
        <SocialProof />
      </div>
    </div>
  );
}

/* ─── Scroll indicator ──────────────────────────────────────── */
export function ScrollIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2">
      <span className="text-[9px] uppercase tracking-[0.25em] font-body" style={{ color: "rgba(255,253,248,0.22)" }}>
        scroll
      </span>
      {/* mouse icon */}
      <div
        className="flex items-start justify-center w-5 h-8 rounded-full border"
        style={{ borderColor: "rgba(255,253,248,0.16)" }}
      >
        <span
          className="mt-1.5 w-0.5 h-2 rounded-full"
          style={{
            background: "rgba(200,155,60,0.75)",
            animation: "scrollDot 1.8s cubic-bezier(0.45,0,0.55,1) infinite",
          }}
        />
      </div>
      <span className="sr-only">Scroll to explore</span>
    </div>
  );
}
