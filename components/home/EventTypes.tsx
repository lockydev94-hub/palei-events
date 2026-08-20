"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCategoryGrid } from "@/components/marketing/EventCategoryCard";
import { useScrollReveal } from "@/lib/useScrollReveal";

export function EventTypes() {
  const heading = useScrollReveal({ threshold: 0.2 });
  const grid = useScrollReveal({ threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  return (
    <Section id="events" className="bg-warmWhite">
      {/* Heading — fades in from right */}
      <div
        ref={heading.ref}
        className={`sr-fade-left ${heading.visible ? "sr-visible" : ""}`}
      >
        <SectionHeading
          eyebrow="Event categories"
          title="One Platform. Every Kind of Event."
          description="From weddings to conferences, school functions to government programmes — a beautiful digital experience for every celebration."
        />
      </div>

      {/* Grid — zooms in */}
      <div
        ref={grid.ref}
        className={`sr-zoom-fade sr-delay-150 ${grid.visible ? "sr-visible" : ""}`}
      >
        <EventCategoryGrid />
      </div>
    </Section>
  );
}
