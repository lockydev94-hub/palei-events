"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventExperiencePreview } from "@/components/device/EventExperiencePreview";
import { useScrollReveal } from "@/lib/useScrollReveal";

export function ExperienceSection() {
  const heading = useScrollReveal({ threshold: 0.2 });
  const preview = useScrollReveal({ threshold: 0.08 });

  return (
    <Section id="experience" className="overflow-hidden bg-navy">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      {/* Heading — slides in from left */}
      <div
        ref={heading.ref}
        className={`sr-fade-right ${heading.visible ? "sr-visible" : ""}`}
      >
        <SectionHeading
          eyebrow="A living event page"
          title="One page. Every moment of your event."
          description="Schedule, gallery, RSVP and guest wishes — everything your guests need, and everything you want to remember."
          tone="dark"
        />
      </div>

      {/* Device preview — flip up */}
      <div
        ref={preview.ref}
        className={`sr-flip-up sr-delay-200 ${preview.visible ? "sr-visible" : ""}`}
      >
        <EventExperiencePreview />
      </div>
    </Section>
  );
}
