"use client";

import { Section } from "@/components/ui/Section";
import { StepCard } from "@/components/marketing/StepCard";
import { useScrollReveal } from "@/lib/useScrollReveal";

const steps = [
  {
    step: "01",
    title: "Create",
    description: "Choose an event type and add your event details in minutes.",
    icon: "sparkles",
  },
  {
    step: "02",
    title: "Customize",
    description: "Pick a beautiful template and personalise your event page.",
    icon: "palette",
  },
  {
    step: "03",
    title: "Invite",
    description: "Share your event with a link or a QR code — guests arrive ready.",
    icon: "qr",
  },
  {
    step: "04",
    title: "Remember",
    description: "Collect photos, messages and memories from every guest who attended.",
    icon: "image",
  },
];

export function HowItWorks() {
  const heading = useScrollReveal({ threshold: 0.2 });
  const card0 = useScrollReveal({ threshold: 0.15 });
  const card1 = useScrollReveal({ threshold: 0.15 });
  const card2 = useScrollReveal({ threshold: 0.15 });
  const card3 = useScrollReveal({ threshold: 0.15 });
  const cta = useScrollReveal({ threshold: 0.3 });

  const cardRefs = [card0, card1, card2, card3];
  const delays = ["", "sr-delay-150", "sr-delay-300", "sr-delay-500"];

  return (
    <Section
      id="how-it-works"
      className="overflow-hidden bg-navy relative"
      ariaLabel="How Palei Events works"
    >
      {/* Dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      {/* Radial glow center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,155,60,0.07), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Section heading — fade up */}
      <div
        ref={heading.ref}
        className={`relative mx-auto max-w-2xl text-center sr-fade-up ${heading.visible ? "sr-visible" : ""}`}
      >
        <span className="inline-block rounded-full border border-gold/25 bg-gold/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-gold">
          How it works
        </span>
        <h2 className="mt-5 font-display text-h2 font-semibold text-ivory text-balance">
          From idea to celebration{" "}
          <span className="text-gradient-gold">in four steps</span>
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ivory/65">
          No design skills needed. Four simple steps take you from idea to a living event experience.
        </p>
      </div>

      {/* Step cards — each staggered with fade-up */}
      <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const { ref, visible } = cardRefs[i];
          return (
            <div
              key={step.step}
              ref={ref}
              className={`sr-fade-up ${delays[i]} ${visible ? "sr-visible" : ""}`}
            >
              <StepCard {...step} />
            </div>
          );
        })}
      </div>

      {/* Bottom CTA — blur reveal */}
      <div
        ref={cta.ref}
        className={`relative mt-14 flex justify-center sr-blur-reveal sr-delay-200 ${cta.visible ? "sr-visible" : ""}`}
      >
        <a
          href="/create-event"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-champagne/70 transition-colors hover:text-champagne"
        >
          Start your first event
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </Section>
  );
}
