"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { useState, useRef } from "react";
import type { Template } from "@/data/templates";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const href = template.demoSlug ? `/e/${template.demoSlug}` : "/e/aarav-ananya-wedding";
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-warmWhite shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-gold/25 hover:shadow-elevated"
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        <Image
          src={template.preview}
          alt={`${template.name} template preview`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-108"
        />

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

        {/* Hover shimmer */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(300px circle at var(--mx) var(--my), rgba(200,155,60,0.18), transparent 70%)",
          }}
        />

        {/* Badges top-left */}
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge tone="navy">{template.category}</Badge>
          <Badge tone="neutral">{template.style}</Badge>
        </div>

        {/* Quick-view overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-400 group-hover:opacity-100">
          <Link
            href={href}
            className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm border border-white/25 transition-all duration-300 hover:bg-white/25 hover:scale-105"
          >
            Quick Preview →
          </Link>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6">
        {/* Mouse-follow glow in card body */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(250px circle at var(--mx) 80%, rgba(200,155,60,0.08), transparent 70%)",
          }}
        />

        <h3 className="relative font-display text-xl font-semibold text-navy transition-colors duration-300 group-hover:text-navy-dark">
          {template.name}
        </h3>
        <p className="relative mt-2 flex-1 text-sm leading-relaxed text-mutedText">
          {template.description}
        </p>

        {/* Actions */}
        <div className="relative mt-6 flex items-center gap-3">
          <Link
            href={href}
            className="flex-1 rounded-xl border border-navy/20 py-2.5 text-center text-sm font-semibold text-navy transition-all duration-300 hover:border-navy hover:bg-navy hover:text-ivory hover:shadow-md"
          >
            View Demo
          </Link>
          <Link
            href="/create-event"
            className="flex-1 rounded-xl bg-gold py-2.5 text-center text-sm font-semibold text-navy-dark transition-all duration-300 hover:bg-gold-light hover:shadow-gold-glow hover:-translate-y-0.5"
          >
            Use Template
          </Link>
        </div>

        {/* Bottom growing accent line */}
        <div className="mt-4 h-0.5 w-0 rounded-full bg-gradient-to-r from-gold/50 to-gold-light/30 transition-all duration-500 group-hover:w-full" />
      </div>
    </div>
  );
}
