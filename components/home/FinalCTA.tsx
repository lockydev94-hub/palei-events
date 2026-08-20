"use client";

import { FullWidthAnimatedSection } from "@/components/animation/FullWidthAnimation";
import { Button } from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const floatingWords = ["Weddings", "Birthdays", "Concerts", "Festivals", "Graduations", "Galas"];

/* Word height in px — must match the h-[56px] on each row */
const WORD_H = 56;

/* ── Rotating word ticker ───────────────────────────────────── */
function WordTicker({ visible }: { visible: boolean }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % floatingWords.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: WORD_H,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease 80ms",
      }}
    >
      <div
        style={{
          transform: `translateY(-${idx * WORD_H}px)`,
          transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {floatingWords.map((word) => (
          <div
            key={word}
            className="flex items-center justify-center"
            style={{ height: WORD_H }}
          >
            <span
              className="font-display font-bold italic"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                background: "linear-gradient(135deg, #e8d5a8 0%, #c89b3c 55%, #f0d080 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {word}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Trust badges row ───────────────────────────────────────── */
const trustItems = [
  { icon: "✦", text: "Free to start" },
  { icon: "✦", text: "No credit card" },
  { icon: "✦", text: "Live in minutes" },
];

/* ── Main component ─────────────────────────────────────────── */
export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay: number, extraStyle?: React.CSSProperties): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    ...extraStyle,
  });

  return (
    <FullWidthAnimatedSection
      animationKey="celebration"
      overlay="dark"
      overlayOpacity={0.78}
      minHeight="min-h-[85vh]"
    >
      <div ref={ref} className="mx-auto max-w-2xl text-center py-20 lg:py-28">

        {/* ── Eyebrow ────────────────────────────────────────── */}
        <div style={anim(0)} className="flex items-center justify-center gap-3">
          <span
            className="h-px w-8 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(200,155,60,0.6))" }}
          />
          <p
            className="text-[10px] font-bold uppercase tracking-[0.32em]"
            style={{ color: "#c89b3c" }}
          >
            Ready when you are
          </p>
          <span
            className="h-px w-8 rounded-full"
            style={{ background: "linear-gradient(90deg, rgba(200,155,60,0.6), transparent)" }}
          />
        </div>

        {/* ── Rotating word ──────────────────────────────────── */}
        <div className="mt-6">
          <WordTicker visible={visible} />
        </div>

        {/* ── Main headline ──────────────────────────────────── */}
        <h2
          className="mt-4 font-display font-semibold text-ivory text-balance leading-tight"
          style={{
            ...anim(160),
            fontSize: "clamp(1.75rem, 3.8vw, 3rem)",
          }}
        >
          Your event is more than a date on a calendar.
        </h2>

        {/* ── Italic subline ─────────────────────────────────── */}
        <p
          className="mt-4 font-display italic"
          style={{
            ...anim(220),
            fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)",
            color: "rgba(232,213,168,0.80)",
          }}
        >
          It&rsquo;s a moment people remember.
        </p>

        {/* ── Decorative gold rule ───────────────────────────── */}
        <div
          className="mx-auto mt-7 h-px max-w-[120px] rounded-full"
          style={{
            ...anim(270),
            background: "linear-gradient(90deg, transparent, rgba(200,155,60,0.5), transparent)",
          }}
        />

        {/* ── Description ────────────────────────────────────── */}
        <p
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed"
          style={{ ...anim(320), color: "rgba(255,253,248,0.60)" }}
        >
          Join thousands of hosts who create unforgettable experiences with Palei Events —
          free to start, beautiful from day one.
        </p>

        {/* ── CTA buttons ────────────────────────────────────── */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          style={anim(390)}
        >
          {/* Primary gold */}
          <Link
            href="/create-event"
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-8 py-4 text-base font-semibold text-navy-dark transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            style={{
              background: "linear-gradient(135deg, #e8d5a8 0%, #c89b3c 55%, #a67f2e 100%)",
              boxShadow: "0 0 40px rgba(200,155,60,0.45), 0 4px 20px rgba(0,0,0,0.35)",
            }}
          >
            {/* shimmer sweep */}
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[200%]"
            />
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="relative h-4 w-4">
              <path d="M10 2l2.09 5.26H18l-3.7 2.69 1.41 4.33L10 11.5l-5.71 2.78 1.41-4.33L2 7.26h5.91L10 2z"/>
            </svg>
            <span className="relative">Create Your Event</span>
          </Link>

          {/* Ghost outline */}
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory/50"
            style={{
              color: "rgba(255,253,248,0.80)",
              border: "1px solid rgba(255,253,248,0.22)",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            See Pricing
          </Link>
        </div>

        {/* ── Trust badges ───────────────────────────────────── */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          style={anim(460)}
        >
          {trustItems.map((t, i) => (
            <span key={t.text} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className="h-3.5 w-px"
                  style={{ background: "rgba(255,253,248,0.14)" }}
                  aria-hidden
                />
              )}
              <span
                className="text-[11px] font-medium"
                style={{ color: "rgba(255,253,248,0.38)" }}
              >
                <span style={{ color: "#c89b3c", marginRight: 4, fontSize: 8 }}>✦</span>
                {t.text}
              </span>
            </span>
          ))}
        </div>

      </div>
    </FullWidthAnimatedSection>
  );
}
