import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/data/pricing";

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const featured = plan.featured;
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5",
        featured
          ? "bg-navy text-ivory shadow-elevated ring-1 ring-gold/40"
          : "border border-navy/10 bg-warmWhite shadow-soft hover:shadow-card"
      )}
    >
      {featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-semibold uppercase tracking-wide text-navy-dark shadow-soft">
          Most Popular
        </span>
      )}

      <h3 className={cn("font-display text-2xl font-semibold", featured ? "text-ivory" : "text-navy")}>
        {plan.name}
      </h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className={cn("font-display text-5xl font-semibold", featured ? "text-champagne" : "text-navy")}>
          {plan.price}
        </span>
        {plan.period && (
          <span className={cn("text-sm", featured ? "text-ivory/70" : "text-mutedText")}>
            {plan.period}
          </span>
        )}
      </div>
      <p className={cn("mt-3 text-sm leading-relaxed", featured ? "text-ivory/80" : "text-mutedText")}>
        {plan.description}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check
              className={cn("mt-0.5 h-4 w-4 shrink-0", featured ? "text-gold" : "text-gold-dark")}
              aria-hidden
            />
            <span className={featured ? "text-ivory/90" : "text-navy/85"}>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href="/create-event"
        className={cn(
          "mt-8 inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300",
          featured
            ? "bg-gold text-navy-dark hover:bg-gold-light hover:-translate-y-0.5"
            : "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-ivory"
        )}
      >
        {plan.cta}
      </a>
    </div>
  );
}