import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: "gold" | "navy" | "rose" | "neutral";
}

const tones = {
  gold: "bg-champagne/60 text-gold-dark border border-gold/30",
  navy: "bg-navy text-champagne border border-navy/20",
  rose: "bg-rose/10 text-rose border border-rose/25",
  neutral: "bg-softGray text-mutedText border border-navy/10",
};

export function Badge({ children, className, tone = "gold" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}