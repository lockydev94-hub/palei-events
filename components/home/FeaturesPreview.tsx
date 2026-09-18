"use client";

import { Section } from "@/components/ui/Section";
import { FeatureSection } from "@/components/marketing/FeatureSection";
import { Button } from "@/components/ui/Button";
import { features as fallbackFeatures } from "@/data/features";
import { useState, useEffect, useMemo } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { getFeatures } from "@/lib/firestore";

const FEATURED_IDS = ["event-website", "rsvp", "qr-code", "photo-gallery", "guest-uploads", "schedule", "analytics"];

function AnimatedFeatureRow({
  feature,
  reverse,
  index,
}: {
  feature: (typeof fallbackFeatures)[number];
  reverse: boolean;
  index: number;
}) {
  const { ref, visible } = useScrollReveal({ threshold: 0.12 });
  const animClass = index % 2 === 0 ? "sr-fade-right" : "sr-fade-left";

  return (
    <div ref={ref} className={`${animClass} ${visible ? "sr-visible" : ""}`}>
      <FeatureSection feature={feature} reverse={reverse} />
    </div>
  );
}

export function FeaturesPreview() {
  const [allFeatures, setAllFeatures] = useState(fallbackFeatures)

  useEffect(() => {
    let cancelled = false
    getFeatures()
      .then((data) => { if (!cancelled && data.length > 0) setAllFeatures(data) })
      .catch(() => {/* keep fallback */})
    return () => { cancelled = true }
  }, [])

  const featured = useMemo(() => {
    const byId = allFeatures.filter((f) => FEATURED_IDS.includes(f.id))
    return byId.length >= 3 ? byId : allFeatures.slice(0, 7)
  }, [allFeatures])

  const heading = useScrollReveal({ threshold: 0.25 });
  const cta = useScrollReveal({ threshold: 0.4 });


  return (
    <Section id="features" className="bg-ivory overflow-hidden">
      {/* Section heading — zoom fade */}
      <div
        ref={heading.ref}
        className={`mx-auto max-w-2xl text-center sr-zoom-fade ${heading.visible ? "sr-visible" : ""}`}
      >
        <span className="inline-block rounded-full border border-gold/25 bg-gold/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-gold-dark">
          Features
        </span>
        <h2 className="mt-5 font-display text-h2 font-semibold text-navy text-balance">
          Everything your event needs
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-mutedText text-pretty">
          From the invitation to the last memory, Palei Events keeps every part of your
          celebration connected in one beautiful page.
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto mt-12 h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Feature rows — each with alternating slide direction */}
      <div className="mt-16 space-y-24 lg:space-y-32">
        {featured.map((feature, index) => (
          <AnimatedFeatureRow
            key={feature.id}
            feature={feature}
            reverse={index % 2 === 1}
            index={index}
          />
        ))}
      </div>

      {/* CTA — fade up */}
      <div
        ref={cta.ref}
        className={`mt-20 flex justify-center sr-fade-up ${cta.visible ? "sr-visible" : ""}`}
      >
        <Button href="/features" variant="outline" size="lg">
          View all features
        </Button>
      </div>
    </Section>
  );
}
