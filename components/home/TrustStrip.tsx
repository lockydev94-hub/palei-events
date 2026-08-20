"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const types = [
  { label: "Wedding", href: "/templates?category=wedding", emoji: "💍" },
  { label: "Birthday", href: "/templates?category=birthday", emoji: "🎂" },
  { label: "Corporate", href: "/templates?category=corporate", emoji: "🏢" },
  { label: "School", href: "/templates?category=school", emoji: "🎓" },
  { label: "College", href: "/templates?category=college", emoji: "🎪" },
  { label: "Government", href: "/templates?category=government", emoji: "🏛️" },
];

const marqueeItems = [...types, ...types, ...types];

export function TrustStrip() {
  const [paused, setPaused] = useState(false);
  const { ref, visible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden border-y border-navy/10 bg-warmWhite py-0 sr-fade-up ${visible ? "sr-visible" : ""}`}
      aria-label="Event types we support"
    >
      {/* subtle shimmer line top */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #c89b3c44 30%, #c89b3c88 50%, #c89b3c44 70%, transparent 100%)",
        }}
      />

      <Container className="pb-5 pt-6">
        <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.3em] text-mutedText/70">
          Made for every kind of celebration
        </p>
      </Container>

      {/* Fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, #faf8f3, transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, #faf8f3, transparent)" }} />

      {/* Marquee track */}
      <div
        className="relative flex overflow-hidden pb-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex min-w-max gap-x-2"
          style={{
            animation: `marquee 28s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {marqueeItems.map((type, idx) => (
            <Link
              key={`${type.label}-${idx}`}
              href={type.href}
              className="group flex items-center gap-2 rounded-full border border-navy/10 bg-ivory px-5 py-2.5 text-sm font-semibold text-navy/70 shadow-soft transition-all duration-300 hover:border-gold/50 hover:bg-gold/5 hover:text-gold-dark hover:shadow-card hover:-translate-y-0.5"
            >
              <span className="text-base transition-transform duration-300 group-hover:scale-125">
                {type.emoji}
              </span>
              {type.label}
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>

      {/* shimmer line bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #c89b3c44 30%, #c89b3c88 50%, #c89b3c44 70%, transparent 100%)",
        }}
      />
    </section>
  );
}
