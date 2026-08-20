import type { Metadata } from "next";
import Link from "next/link";
import { FullWidthAnimatedSection } from "@/components/animation/FullWidthAnimation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Palei Events — a digital event platform born in Bhubaneswar, Odisha, built to make every wedding, birthday, corporate event and celebration easier to create, share and remember.",
  keywords: ["Palei Events about", "event platform Odisha", "digital event experience India", "Bhubaneswar event platform"],
  openGraph: {
    title: "About Palei Events — Our Mission & Story",
    description: "Palei Events is built to make every event easier to create, share and remember. Rooted in Odisha, crafted for India.",
    url: "https://paleievents.com/about",
  },
  alternates: { canonical: "/about" },
};

/* ── Design tokens ─────────────────────────────────────────── */
const GOLD = "#c89b3c";
const GOLD_LIGHT = "#e0c584";
const GOLD_PALE = "#f5dfa0";
const NAVY = "#172033";
const NAVY_DARK = "#0f1522";

/* ── Sparkle SVG ────────────────────────────────────────────── */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
    </svg>
  );
}

/* ── Gold ornament divider ──────────────────────────────────── */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2" aria-hidden>
      <div style={{ height: "1px", width: "48px", background: `linear-gradient(90deg, transparent, ${GOLD}66)` }} />
      <span style={{ color: `${GOLD}80` }}><Sparkle className="h-2.5 w-2.5" /></span>
      <div style={{ height: "1px", width: "48px", background: `linear-gradient(90deg, ${GOLD}66, transparent)` }} />
    </div>
  );
}

/* ── Page hero ─────────────────────────────────────────────── */
function AboutHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${NAVY_DARK} 0%, ${NAVY} 100%)` }}
      aria-label="About Palei Events"
    >
      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.055]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${GOLD_LIGHT} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
        }}
        aria-hidden
      />
      {/* gold bloom — top right */}
      <div
        className="absolute -top-40 -right-40 pointer-events-none"
        style={{
          width: "600px", height: "600px", borderRadius: "50%",
          background: `radial-gradient(circle, rgba(200,155,60,0.18) 0%, rgba(200,155,60,0.04) 50%, transparent 70%)`,
          filter: "blur(30px)",
        }}
        aria-hidden
      />
      {/* gold bloom — bottom left */}
      <div
        className="absolute -bottom-32 -left-32 pointer-events-none"
        style={{
          width: "400px", height: "400px", borderRadius: "50%",
          background: `radial-gradient(circle, rgba(200,155,60,0.10) 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      <div className="container-shell relative z-10 pt-40 pb-28 md:pt-48 md:pb-32">
        {/* eyebrow */}
        <div
          className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8"
          style={{
            background: "rgba(200,155,60,0.13)",
            border: "1px solid rgba(200,155,60,0.32)",
            backdropFilter: "blur(10px)",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-50" style={{ background: GOLD }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: GOLD_LIGHT }} />
          </span>
          <span className="text-[0.67rem] font-semibold uppercase tracking-[0.22em]" style={{ color: GOLD_LIGHT }}>
            About Palei Events
          </span>
        </div>

        {/* breadcrumb */}
        <div className="mb-7">
          <Breadcrumb
            light
            items={[
              { label: "Home", href: "/" },
              { label: "About" },
            ]}
          />
        </div>

        {/* headline */}
        <h1
          className="font-display font-semibold leading-[1.06] tracking-tight text-ivory text-balance"
          style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.6rem)", maxWidth: "820px" }}
        >
          Every event deserves{" "}
          <span
            style={{
              background: `linear-gradient(110deg, ${GOLD_PALE} 0%, ${GOLD_LIGHT} 35%, ${GOLD} 65%, ${GOLD_PALE} 100%)`,
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmerGold 4.5s linear infinite",
              display: "inline",
            }}
          >
            to be remembered
          </span>
        </h1>

        {/* decorative rule */}
        <div
          className="mt-8 mb-7"
          style={{ height: "2px", width: "56px", background: `linear-gradient(90deg, ${GOLD}, rgba(200,155,60,0.2))`, borderRadius: "1px" }}
          aria-hidden
        />

        {/* description */}
        <p
          className="max-w-[580px] leading-[1.85] text-pretty"
          style={{ fontSize: "1.08rem", color: "rgba(255,253,248,0.65)", letterSpacing: "0.012em" }}
        >
          Palei Events is being built to make every event easier to create, share, experience
          and remember — rooted in the warmth of{" "}
          <span style={{ color: "rgba(255,253,248,0.85)", fontStyle: "italic" }}>Odisha's celebrations</span>
          , built for every celebration across India.
        </p>
      </div>
    </section>
  );
}

/* ── Values data ────────────────────────────────────────────── */
const values = [
  {
    number: "01",
    title: "Every event matters",
    description:
      "A wedding, a school annual day and a community conference deserve the same care. We build for all of them.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Odisha roots, national reach",
    description:
      "Our identity is inspired by Odisha's craft and culture — our product is built to serve every celebration across India.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Technology in service of emotion",
    description:
      "Tools should disappear so the celebration can shine. We keep the platform simple and the experience beautiful.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.998.228-1.974.62-2.81A5 5 0 1010.33 8H10a5 5 0 014.01 2.01A4.002 4.002 0 0112 14z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Memories outlive events",
    description:
      "The day ends, but the gallery, wishes and moments we help you keep should stay with you forever.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
      </svg>
    ),
  },
];

/* ── Value card ─────────────────────────────────────────────── */
function ValueCard({ value, index }: { value: (typeof values)[0]; index: number }) {
  return (
    <div
      className="group relative rounded-3xl overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(255,253,248,0.97)",
        border: "1px solid rgba(200,155,60,0.13)",
        boxShadow: "0 4px 24px rgba(23,32,51,0.07)",
      }}
    >
      {/* top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
        aria-hidden
      />

      {/* Number + icon row */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="flex items-center justify-center h-11 w-11 rounded-2xl flex-shrink-0"
          style={{
            background: `linear-gradient(145deg, rgba(200,155,60,0.18), rgba(200,155,60,0.07))`,
            border: "1px solid rgba(200,155,60,0.25)",
            color: GOLD,
          }}
        >
          {value.icon}
        </div>
        <span
          className="font-display font-bold leading-none select-none"
          style={{ fontSize: "2.2rem", color: "rgba(200,155,60,0.12)" }}
          aria-hidden
        >
          {value.number}
        </span>
      </div>

      <h3 className="font-display text-[1.07rem] font-semibold leading-snug mb-2.5" style={{ color: NAVY }}>
        {value.title}
      </h3>
      <p className="text-[0.88rem] leading-relaxed text-mutedText">{value.description}</p>
    </div>
  );
}

/* ── Roadmap items ──────────────────────────────────────────── */
const roadmap = [
  { label: "AI event assistant", soon: true },
  { label: "Deeper analytics", soon: false },
  { label: "Multi-language pages", soon: false },
  { label: "Team collaboration", soon: true },
  { label: "Payment collection", soon: false },
  { label: "WhatsApp invitations", soon: true },
];

/* ── Stats row ──────────────────────────────────────────────── */
const stats = [
  { value: "10K+", label: "Events Created" },
  { value: "50+", label: "Templates" },
  { value: "10+", label: "Event Types" },
  { value: "98%", label: "Satisfaction" },
];

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      {/* ── Mission section ── */}
      <section className="section-pad bg-warmWhite" aria-label="Our mission">
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">

            {/* Left — text */}
            <div>
              {/* eyebrow */}
              <div className="inline-flex items-center gap-2 mb-6">
                <div style={{ height: "1.5px", width: "32px", background: `linear-gradient(90deg, transparent, ${GOLD})` }} aria-hidden />
                <span className="text-[0.67rem] font-semibold uppercase tracking-[0.22em]" style={{ color: GOLD_DARK }}>
                  Our mission
                </span>
              </div>

              <h2
                className="font-display font-semibold leading-[1.1] tracking-tight text-balance"
                style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: NAVY }}
              >
                One digital experience for every celebration
              </h2>

              <div style={{ height: "2px", width: "48px", background: `linear-gradient(90deg, ${GOLD}, rgba(200,155,60,0.2))`, borderRadius: "1px", margin: "1.5rem 0" }} aria-hidden />

              <p className="text-[1.05rem] leading-[1.85] text-mutedText text-pretty mb-5">
                Today, planning an event often means scattered links, endless WhatsApp threads and
                photos lost across a dozen phones. We believe every event deserves a single,
                beautiful home — a place where schedules, invitations, RSVPs, photos and wishes all
                come together.
              </p>
              <p className="text-[1.05rem] leading-[1.85] text-mutedText text-pretty">
                Born from the warmth of Odisha&rsquo;s celebrations, Palei Events brings that same
                spirit to a modern platform — capable of hosting a wedding today, a corporate
                conference tomorrow, and a college fest the week after.
              </p>

              {/* CTA */}
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/create-event"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl px-7 py-3.5 font-semibold text-[0.95rem] transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD} 50%, #a67f2e 100%)`,
                    boxShadow: `0 0 32px rgba(200,155,60,0.4), 0 4px 16px rgba(0,0,0,0.15)`,
                    color: NAVY_DARK,
                  }}
                >
                  <span
                    className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }}
                    aria-hidden
                  />
                  Create Your Event
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-semibold text-[0.95rem] transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    border: `1px solid rgba(23,32,51,0.15)`,
                    color: NAVY,
                    background: "rgba(255,255,255,0.6)",
                  }}
                >
                  Get in touch
                </Link>
              </div>
            </div>

            {/* Right — value cards */}
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, i) => (
                <ValueCard key={value.number} value={value} index={i} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats band ── */}
      <section
        className="py-16 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 100%)` }}
        aria-label="Platform statistics"
      >
        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,155,60,0.07) 0%, transparent 70%)" }}
          aria-hidden
        />
        <Container>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="font-display font-bold leading-none"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 2.8rem)",
                    background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.72rem] uppercase tracking-[0.2em] font-semibold" style={{ color: "rgba(255,253,248,0.38)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Roadmap section ── */}
      <section className="section-pad bg-ivory" aria-label="What's coming">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-5">
              <div style={{ height: "1.5px", width: "32px", background: `linear-gradient(90deg, transparent, ${GOLD})` }} aria-hidden />
              <span className="text-[0.67rem] font-semibold uppercase tracking-[0.22em]" style={{ color: GOLD_DARK }}>
                The road ahead
              </span>
              <div style={{ height: "1.5px", width: "32px", background: `linear-gradient(90deg, ${GOLD}, transparent)` }} aria-hidden />
            </div>
            <h2
              className="font-display font-semibold leading-[1.1] text-balance"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.7rem)", color: NAVY }}
            >
              Built to grow with your events
            </h2>
            <p className="mt-5 text-[1rem] leading-[1.8] text-mutedText text-pretty">
              Our roadmap is driven by how people actually celebrate: more event types, deeper
              galleries, smarter tools and AI assistance that makes creating events even faster.
            </p>
          </div>

          {/* Roadmap card */}
          <div
            className="max-w-3xl mx-auto rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,253,248,0.96)",
              border: "1px solid rgba(200,155,60,0.14)",
              boxShadow: "0 10px 48px rgba(23,32,51,0.08)",
            }}
          >
            {/* card header */}
            <div
              className="px-8 py-5 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, rgba(200,155,60,0.09) 0%, rgba(200,155,60,0.03) 100%)",
                borderBottom: "1px solid rgba(200,155,60,0.12)",
              }}
            >
              <div
                className="flex items-center justify-center h-9 w-9 rounded-xl"
                style={{ background: `linear-gradient(135deg, ${NAVY}, #22304d)` }}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill={GOLD_LIGHT} aria-hidden>
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.998.228-1.974.62-2.81A5 5 0 1010.33 8H10a5 5 0 014.01 2.01A4.002 4.002 0 0112 14z" />
                </svg>
              </div>
              <h3 className="font-display text-[1.05rem] font-semibold" style={{ color: NAVY }}>
                What&rsquo;s coming
              </h3>
            </div>

            {/* roadmap items */}
            <div className="p-8 grid gap-3 sm:grid-cols-2">
              {roadmap.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3.5 group transition-all duration-200 hover:bg-warmWhite"
                  style={{ border: "1px solid transparent" }}
                >
                  <span
                    className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-lg"
                    style={{ background: "rgba(200,155,60,0.13)" }}
                  >
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill={GOLD} aria-hidden>
                      <path d="M6 0C6 0 6.375 2.625 7.5 4.125C8.625 5.625 12 6 12 6C12 6 8.625 6.375 7.5 7.875C6.375 9.375 6 12 6 12C6 12 5.625 9.375 4.5 7.875C3.375 6.375 0 6 0 6C0 6 3.375 5.625 4.5 4.125C5.625 2.625 6 0 6 0Z" />
                    </svg>
                  </span>
                  <span className="text-[0.9rem] font-medium" style={{ color: NAVY }}>
                    {item.label}
                  </span>
                  {item.soon && (
                    <span
                      className="ml-auto text-[0.6rem] font-semibold uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(200,155,60,0.12)", color: GOLD }}
                    >
                      Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Full-width CTA ── */}
      <FullWidthAnimatedSection
        animationKey="odishaFlow"
        overlay="dark"
        overlayOpacity={0.74}
        minHeight="min-h-[56vh]"
      >
        {/* extra gold bloom overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(200,155,60,0.12) 0%, transparent 70%)" }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          {/* ornament */}
          <div className="flex items-center justify-center gap-3 mb-7" aria-hidden>
            <div style={{ height: "1px", width: "40px", background: `linear-gradient(90deg, transparent, ${GOLD}66)` }} />
            <span style={{ color: `${GOLD}80` }}><Sparkle className="h-3 w-3" /></span>
            <div style={{ height: "1px", width: "40px", background: `linear-gradient(90deg, ${GOLD}66, transparent)` }} />
          </div>

          <h2
            className="font-display font-semibold leading-[1.08] text-ivory text-balance"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
          >
            Create.{" "}
            <span
              style={{
                background: `linear-gradient(110deg, ${GOLD_PALE} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline",
              }}
            >
              Celebrate.
            </span>{" "}
            Remember.
          </h2>
          <p className="mt-5 text-[1.05rem] leading-[1.8]" style={{ color: "rgba(255,253,248,0.72)" }}>
            Join us in making every event a beautiful, lasting experience.
          </p>
          <div className="mt-10">
            <Link
              href="/create-event"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl px-9 py-4 font-semibold text-[1rem] transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD} 50%, #a67f2e 100%)`,
                boxShadow: `0 0 48px rgba(200,155,60,0.5), 0 4px 20px rgba(0,0,0,0.3)`,
                color: NAVY_DARK,
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
                aria-hidden
              />
              Create Your Event
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </FullWidthAnimatedSection>
    </>
  );
}

// needed for inline style references below
const GOLD_DARK = "#a67f2e";
