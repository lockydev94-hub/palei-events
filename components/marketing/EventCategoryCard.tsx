"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { eventCategories, eventTypeMeta, type EventType } from "@/data/events";
import { useRef, useState } from "react";

interface EventCategoryCardProps {
  type: EventType;
  index: number;
}

const accentColors: Record<string, { bg: string; glow: string; badge: string }> = {
  wedding:    { bg: "from-rose/20 to-champagne/30",   glow: "rgba(232,140,155,0.35)", badge: "bg-rose/15 text-rose" },
  birthday:   { bg: "from-coral/20 to-champagne/30",  glow: "rgba(242,155,122,0.35)", badge: "bg-coral/15 text-coral" },
  corporate:  { bg: "from-navy/20 to-navy/5",         glow: "rgba(23,32,51,0.25)",    badge: "bg-navy/10 text-navy" },
  school:     { bg: "from-sage/20 to-champagne/20",   glow: "rgba(147,168,138,0.3)",  badge: "bg-sage/20 text-sage" },
  college:    { bg: "from-purple/20 to-champagne/20", glow: "rgba(155,122,203,0.3)",  badge: "bg-purple/15 text-purple" },
  government: { bg: "from-gold/20 to-champagne/20",   glow: "rgba(200,155,60,0.3)",   badge: "bg-gold/15 text-gold-dark" },
  conference: { bg: "from-navy/15 to-navy/5",         glow: "rgba(23,32,51,0.2)",     badge: "bg-navy/10 text-navy" },
  cultural:   { bg: "from-coral/15 to-rose/10",       glow: "rgba(242,155,122,0.25)", badge: "bg-coral/10 text-coral" },
  sports:     { bg: "from-sage/15 to-champagne/15",   glow: "rgba(147,168,138,0.25)", badge: "bg-sage/15 text-sage" },
  community:  { bg: "from-gold/15 to-champagne/15",   glow: "rgba(200,155,60,0.25)",  badge: "bg-gold/10 text-gold-dark" },
};

export function EventCategoryCard({ type, index }: EventCategoryCardProps) {
  const meta = eventTypeMeta[type];
  const accent = accentColors[type] ?? accentColors.corporate;
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <Link
      ref={cardRef}
      href={`/templates?category=${meta.label.toLowerCase()}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-warmWhite p-7 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-gold/30 hover:shadow-elevated"
      style={{
        animationDelay: `${index * 80}ms`,
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      } as React.CSSProperties}
    >
      {/* Mouse-follow radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), ${accent.glow}, transparent 70%)`,
        }}
      />

      {/* Gradient fill on hover */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.bg} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />

      {/* Number badge */}
      <span
        className="absolute right-5 top-4 font-display text-4xl font-bold text-navy/5 transition-all duration-500 group-hover:text-navy/8 select-none"
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icon */}
      <span className="relative flex h-13 w-13 items-center justify-center rounded-xl bg-navy text-champagne shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-4deg] group-hover:bg-gold group-hover:text-navy-dark group-hover:shadow-gold-glow">
        <Icon name={meta.icon} className="h-6 w-6" />
      </span>

      {/* Text */}
      <div className="relative mt-5 flex-1">
        <h3 className="font-display text-xl font-semibold text-navy transition-colors duration-300 group-hover:text-navy-dark">
          {meta.label}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-mutedText">{meta.description}</p>
      </div>

      {/* CTA row */}
      <div className="relative mt-6 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${accent.badge} transition-all duration-300 group-hover:scale-105`}
        >
          {meta.label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/15 text-navy/40 transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-navy-dark group-hover:translate-x-0.5">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Bottom border accent that grows on hover */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gold to-gold-light transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}

export function EventCategoryGrid() {
  return (
    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {eventCategories.map((category, index) => (
        <EventCategoryCard key={category.type} type={category.type} index={index} />
      ))}
    </div>
  );
}
