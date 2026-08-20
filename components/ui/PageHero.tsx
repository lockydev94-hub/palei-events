import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy pt-32 pb-20 md:pt-40 md:pb-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full"
        style={{ background: "rgba(200, 155, 60, 0.18)", filter: "blur(80px)" }}
        aria-hidden
      />
      <div className="container-shell relative">
        <Badge tone="navy">{eyebrow}</Badge>
        <h1 className="mt-6 max-w-3xl font-display text-display2 font-semibold text-ivory text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80 text-pretty">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}