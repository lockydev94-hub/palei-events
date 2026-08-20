import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { CheckCircle2 } from "lucide-react";
import type { Solution } from "@/data/solutions";

interface SolutionDetailProps {
  solution: Solution;
  reverse?: boolean;
}

export function SolutionDetail({ solution, reverse = false }: SolutionDetailProps) {
  return (
    <section aria-label={solution.audience}>
      <Container className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <Badge tone="gold" className="mb-5">
            {solution.audience}
          </Badge>
          <h2 className="font-display text-h3 font-semibold text-navy text-balance">
            {solution.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-mutedText text-pretty">
            {solution.description}
          </p>

          <ul className="mt-7 space-y-3">
            {solution.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-navy/85">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-2">
            {solution.features.map((feature) => (
              <span
                key={feature}
                className="flex items-center gap-1.5 rounded-full bg-champagne/50 px-3.5 py-1.5 text-xs font-semibold text-gold-dark"
              >
                <Icon name={feature.toLowerCase().includes("rsvp") ? "check" : "sparkles"} className="h-3.5 w-3.5" />
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-card">
            <Image
              src={solution.image}
              alt={solution.audience}
              width={800}
              height={600}
              unoptimized
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div
            className="pointer-events-none absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full"
            style={{ backgroundColor: "rgba(200, 155, 60, 0.18)" }}
            aria-hidden
          />
        </div>
      </Container>
    </section>
  );
}