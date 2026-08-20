"use client";

import { Icon } from "@/components/ui/Icon";
import { useRef } from "react";

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  icon: string;
}

const stepGradients = [
  { line: "from-gold/0 via-gold to-gold/0", dot: "bg-gold", num: "text-gold/20" },
  { line: "from-champagne/0 via-champagne to-champagne/0", dot: "bg-champagne", num: "text-champagne/20" },
  { line: "from-gold/0 via-gold to-gold/0", dot: "bg-gold", num: "text-gold/20" },
  { line: "from-champagne/0 via-champagne to-champagne/0", dot: "bg-champagne", num: "text-champagne/20" },
];

export function StepCard({ step, title, description, icon }: StepCardProps) {
  const idx = parseInt(step, 10) - 1;
  const g = stepGradients[idx % stepGradients.length];
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy/60 p-8 shadow-elevated backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-gold/30"
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      {/* Mouse-follow highlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(180px circle at var(--mx) var(--my), rgba(200,155,60,0.12), transparent 70%)",
        }}
      />

      {/* Step connector line (hidden on last item via CSS) */}
      <div
        className={`step-connector pointer-events-none absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-full bg-gradient-to-r ${g.line} opacity-40 lg:block`}
        aria-hidden
      />

      {/* Top row: icon + step number */}
      <div className="relative flex items-start justify-between">
        <span className="flex h-13 w-13 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-champagne transition-all duration-400 group-hover:scale-110 group-hover:bg-gold/20 group-hover:border-gold/40 group-hover:text-gold-light group-hover:rotate-3">
          <Icon name={icon} className="h-6 w-6" />
        </span>
        <span
          className={`font-display text-5xl font-bold ${g.num} transition-all duration-400 group-hover:text-gold/30 select-none`}
          aria-hidden
        >
          {step}
        </span>
      </div>

      {/* Content */}
      <div className="relative mt-7">
        <h3 className="font-display text-xl font-semibold text-ivory transition-colors duration-300 group-hover:text-champagne">
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-ivory/55 transition-colors duration-300 group-hover:text-ivory/75">
          {description}
        </p>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gold/60 to-gold-light/40 transition-all duration-500 group-hover:w-full" />

      {/* Corner dot */}
      <div className={`absolute bottom-4 right-4 h-1.5 w-1.5 rounded-full ${g.dot} opacity-0 transition-all duration-500 group-hover:opacity-60 group-hover:scale-125`} />
    </div>
  );
}
