"use client";

import { Section } from "@/components/ui/Section";
import { TemplateCard } from "@/components/marketing/TemplateCard";
import { Button } from "@/components/ui/Button";
import { templates } from "@/data/templates";
import { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const allShowcase = templates.filter((t) =>
  ["royal-wedding", "birthday-celebration", "corporate-conference", "school-annual-day", "college-fest", "government-event"].some((id) => t.id === id)
);

const categories = ["All", ...Array.from(new Set(allShowcase.map((t) => t.category)))];

export function TemplatesPreview() {
  const [activeCategory, setActiveCategory] = useState("All");
  const heading = useScrollReveal({ threshold: 0.2 });
  const filters = useScrollReveal({ threshold: 0.2 });
  const grid = useScrollReveal({ threshold: 0.08 });
  const cta = useScrollReveal({ threshold: 0.3 });

  const showcase = activeCategory === "All"
    ? allShowcase
    : allShowcase.filter((t) => t.category === activeCategory);

  return (
    <Section id="templates" className="bg-warmWhite overflow-hidden">
      {/* Heading — flip up */}
      <div
        ref={heading.ref}
        className={`mx-auto max-w-2xl text-center sr-flip-up ${heading.visible ? "sr-visible" : ""}`}
      >
        <span className="inline-block rounded-full border border-gold/25 bg-gold/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-gold-dark">
          Templates
        </span>
        <h2 className="mt-5 font-display text-h2 font-semibold text-navy text-balance">
          Beautiful templates for every occasion
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-mutedText text-pretty">
          Start from a crafted design and make it yours — every template adapts to your event&rsquo;s
          colours and words in seconds.
        </p>
      </div>

      {/* Filter pills — fade up */}
      <div
        ref={filters.ref}
        className={`mt-10 flex flex-wrap items-center justify-center gap-2 sr-fade-up sr-delay-150 ${filters.visible ? "sr-visible" : ""}`}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              cat === activeCategory
                ? "bg-gold text-navy-dark shadow-gold-glow"
                : "border border-navy/15 bg-ivory text-navy/60 hover:border-gold/40 hover:text-navy hover:-translate-y-0.5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid — rise stagger */}
      <div
        ref={grid.ref}
        className={`mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sr-rise sr-delay-200 ${grid.visible ? "sr-visible" : ""}`}
      >
        {showcase.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* CTA */}
      <div
        ref={cta.ref}
        className={`mt-12 flex justify-center sr-fade-up sr-delay-100 ${cta.visible ? "sr-visible" : ""}`}
      >
        <Button href="/templates" variant="outline" size="lg">
          Browse all templates
        </Button>
      </div>
    </Section>
  );
}
