"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";
import type { Solution } from "@/data/solutions";

interface SolutionCardProps {
  solution: Solution;
  className?: string;
}

export function SolutionCard({ solution, className = "" }: SolutionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

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
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-warmWhite shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-gold/25 hover:shadow-elevated ${className}`}
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-navy">
        <Image
          src={solution.image}
          alt={solution.audience}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />

        {/* Radial highlight on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(250px circle at var(--mx) var(--my), rgba(200,155,60,0.2), transparent 70%)",
          }}
        />

        {/* Audience badge — bottom left */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-ivory">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/25 backdrop-blur-sm ring-1 ring-gold/40 transition-all duration-300 group-hover:bg-gold/40">
            <Icon name={solution.icon} className="h-4 w-4 text-champagne" />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.16em]">{solution.audience}</span>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col p-6">
        {/* Mouse-follow glow */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx) 80%, rgba(200,155,60,0.07), transparent 70%)",
          }}
        />

        <h3 className="relative font-display text-xl font-semibold text-navy transition-colors duration-300 group-hover:text-navy-dark">
          {solution.title}
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-mutedText">
          {solution.description}
        </p>

        {/* Benefits */}
        <ul className="relative mt-5 space-y-2">
          {solution.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm text-navy/80">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-gold transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              />
              {benefit}
            </li>
          ))}
        </ul>

        {/* Feature tags */}
        <div className="relative mt-5 flex flex-wrap gap-2 pt-1">
          {solution.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-gold/20 bg-champagne/40 px-3 py-1 text-xs font-semibold text-gold-dark transition-all duration-300 hover:border-gold/50 hover:bg-champagne/70 hover:-translate-y-0.5 cursor-default"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Bottom accent */}
        <div className="relative mt-5 h-0.5 w-0 rounded-full bg-gradient-to-r from-gold/50 to-gold-light/20 transition-all duration-500 group-hover:w-full" />
      </div>
    </div>
  );
}
