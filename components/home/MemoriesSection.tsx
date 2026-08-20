"use client";

import { Section } from "@/components/ui/Section";
import { Image as ImageIcon, Heart, Star, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const placeholders = [
  { label: "Wedding moments", icon: Heart, color: "text-rose", bg: "bg-rose/10", border: "border-rose/20" },
  { label: "Birthday joy", icon: Star, color: "text-gold-dark", bg: "bg-gold/10", border: "border-gold/20" },
  { label: "Family together", icon: Camera, color: "text-purple", bg: "bg-purple/10", border: "border-purple/20" },
  { label: "Guest uploads", icon: ImageIcon, color: "text-sage", bg: "bg-sage/10", border: "border-sage/20" },
];

const wishCards = [
  { name: "Priya S.", msg: "The most beautiful wedding page I've ever seen! ✨", relation: "Guest" },
  { name: "Rohan M.", msg: "Sharing photos was so easy. Loved every moment.", relation: "Friend" },
  { name: "Ananya K.", msg: "Our guests are still posting photos days later! 🎉", relation: "Host" },
];

export function MemoriesSection() {
  const [activeWish, setActiveWish] = useState(0);
  const heading = useScrollReveal({ threshold: 0.2 });
  const left = useScrollReveal({ threshold: 0.1 });
  const right = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    const id = setInterval(() => {
      setActiveWish((prev) => (prev + 1) % wishCards.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <Section id="memories" className="overflow-hidden bg-ivory relative" ariaLabel="Memories feature">
      {/* Decorative GIF top-right */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-48 w-48 overflow-hidden opacity-25"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/animation/Floating Floral Petals.gif"
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: "center" }}
        />
      </div>
      {/* Decorative GIF bottom-left */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-36 w-36 overflow-hidden opacity-15"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/animation/Soft Golden Bokeh.gif"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Heading — blur reveal */}
      <div
        ref={heading.ref}
        className={`relative mx-auto max-w-2xl text-center sr-blur-reveal ${heading.visible ? "sr-visible" : ""}`}
      >
        <span className="inline-block rounded-full border border-gold/25 bg-gold/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-gold-dark">
          Memories
        </span>
        <h2 className="mt-5 font-display text-h2 font-semibold text-navy text-balance">
          Every celebration,{" "}
          <em className="not-italic text-gradient-gold">remembered forever</em>
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-mutedText text-pretty">
          Galleries grow with every guest who shares a photo. Your event becomes a living
          keepsake — long after the last song plays.
        </p>
      </div>

      {/* Main content grid */}
      <div className="relative mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Left: photo grid — slides in from right */}
        <div
          ref={left.ref}
          className={`grid grid-cols-2 gap-4 sr-fade-left ${left.visible ? "sr-visible" : ""}`}
        >
          {placeholders.map((p, i) => {
            const Ico = p.icon;
            return (
              <div
                key={i}
                className={`group relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border ${p.border} ${p.bg} transition-all duration-500 hover:-translate-y-2 hover:shadow-card cursor-default`}
              >
                <div
                  className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                  }}
                />
                <Ico
                  className={`h-10 w-10 ${p.color} transition-all duration-500 group-hover:scale-125 group-hover:drop-shadow-md`}
                  strokeWidth={1.2}
                  aria-hidden
                />
                <span className="text-center text-[0.65rem] font-semibold text-navy/50 px-2">
                  {p.label}
                </span>
                <div
                  className={`absolute h-16 w-16 rounded-full border ${p.border} opacity-0 transition-all duration-500 group-hover:opacity-40 group-hover:scale-150`}
                />
              </div>
            );
          })}
        </div>

        {/* Right: testimonials — slides in from left */}
        <div
          ref={right.ref}
          className={`flex flex-col gap-6 sr-fade-right sr-delay-150 ${right.visible ? "sr-visible" : ""}`}
        >
          <div className="inline-flex items-center gap-3 self-start rounded-full border border-gold/25 bg-champagne/40 px-5 py-2.5">
            <span className="font-display text-2xl font-bold text-gold-dark">∞</span>
            <span className="text-sm font-semibold text-navy/70">memories per event</span>
          </div>

          <div className="relative h-40 overflow-hidden rounded-2xl">
            {wishCards.map((w, i) => (
              <div
                key={i}
                className={`absolute inset-0 rounded-2xl border border-navy/10 bg-warmWhite p-6 shadow-soft transition-all duration-500 ${
                  i === activeWish
                    ? "translate-y-0 opacity-100"
                    : i === (activeWish - 1 + wishCards.length) % wishCards.length
                    ? "-translate-y-4 opacity-0 pointer-events-none"
                    : "translate-y-4 opacity-0 pointer-events-none"
                }`}
              >
                <p className="text-sm leading-relaxed text-navy/80 italic">&ldquo;{w.msg}&rdquo;</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 font-display text-sm font-bold text-gold-dark">
                    {w.name[0]}
                  </span>
                  <span className="text-xs font-semibold text-navy/60">{w.name}</span>
                  <span className="text-xs text-mutedText">· {w.relation}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {wishCards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveWish(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeWish ? "w-6 bg-gold" : "w-2 bg-navy/20 hover:bg-gold/40"
                }`}
                aria-label={`Show wish ${i + 1}`}
              />
            ))}
          </div>

          <p className="text-sm text-mutedText leading-relaxed">
            Guest photos, wishes and shared moments appear the moment your event goes live.
            Every upload becomes a permanent keepsake for you and your guests.
          </p>

          <a
            href="/create-event"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-dark transition-colors hover:text-gold"
          >
            Start collecting memories
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
