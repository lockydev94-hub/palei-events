"use client";

import { Section } from "@/components/ui/Section";
import { SolutionCard } from "@/components/marketing/SolutionCard";
import { Button } from "@/components/ui/Button";
import { solutions as fallbackSolutions } from "@/data/solutions";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { getSolutions } from "@/lib/firestore";

const delays = ["", "sr-delay-100", "sr-delay-200", "sr-delay-300", "sr-delay-400", "sr-delay-500"];

export function SolutionsPreview() {
  const [solutions, setSolutions] = useState(fallbackSolutions)

  useEffect(() => {
    let cancelled = false
    getSolutions()
      .then((data) => { if (!cancelled && data.length > 0) setSolutions(data) })
      .catch(() => {/* keep fallback */})
    return () => { cancelled = true }
  }, [])

  const heading = useScrollReveal({ threshold: 0.2 });
  const grid = useScrollReveal({ threshold: 0.08 });
  const cta = useScrollReveal({ threshold: 0.3 });

  return (
    <Section id="solutions" className="bg-warmWhite overflow-hidden">
      {/* Heading — fade left */}
      <div
        ref={heading.ref}
        className={`mx-auto max-w-2xl text-center sr-fade-left ${heading.visible ? "sr-visible" : ""}`}
      >
        <span className="inline-block rounded-full border border-gold/25 bg-gold/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-gold-dark">
          Solutions
        </span>
        <h2 className="mt-5 font-display text-h2 font-semibold text-navy text-balance">
          Built for the people behind events
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-mutedText text-pretty">
          Whether you plan one wedding a year or run events for an entire organisation,
          there&rsquo;s a Palei solution designed for you.
        </p>
      </div>

      {/* Cards — rise stagger per card */}
      <div
        ref={grid.ref}
        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {solutions.slice(0, 6).map((solution, i) => (
          <div
            key={solution.id}
            className={`sr-rise ${delays[i]} ${grid.visible ? "sr-visible" : ""}`}
          >
            <SolutionCard solution={solution} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        ref={cta.ref}
        className={`mt-12 flex justify-center sr-fade-up sr-delay-200 ${cta.visible ? "sr-visible" : ""}`}
      >
        <Button href="/solutions" variant="outline" size="lg">
          Explore all solutions
        </Button>
      </div>
    </Section>
  );
}
