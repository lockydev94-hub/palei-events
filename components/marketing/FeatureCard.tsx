import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import type { Feature } from "@/data/features";

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-navy/10 bg-warmWhite p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-card">
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-champagne transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-dark">
          <Icon name={feature.icon} className="h-6 w-6" />
        </span>
        {feature.comingSoon && (
          <Badge tone="neutral">Coming soon</Badge>
        )}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-navy">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mutedText">{feature.description}</p>
    </div>
  );
}