import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";

const GOLD = "#c89b3c";
const GOLD_LIGHT = "#e0c584";
const GOLD_PALE = "#f5dfa0";
const GOLD_DARK = "#a67f2e";
const NAVY = "#172033";
const NAVY_DARK = "#0f1522";

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
    </svg>
  );
}

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
  ctaTitle: string;
}

export function LegalLayout({
  eyebrow,
  title,
  highlight,
  description,
  lastUpdated,
  sections,
  ctaTitle,
}: LegalLayoutProps) {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${NAVY_DARK} 0%, ${NAVY} 100%)` }}
        aria-label={`${eyebrow} — Palei Events`}
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
        {/* gold bloom top right */}
        <div
          className="absolute -top-40 -right-40 pointer-events-none"
          style={{
            width: "600px", height: "600px", borderRadius: "50%",
            background: `radial-gradient(circle, rgba(200,155,60,0.16) 0%, rgba(200,155,60,0.04) 50%, transparent 70%)`,
            filter: "blur(30px)",
          }}
          aria-hidden
        />
        {/* purple accent bottom left */}
        <div
          className="absolute -bottom-32 -left-32 pointer-events-none"
          style={{
            width: "420px", height: "420px", borderRadius: "50%",
            background: `radial-gradient(circle, rgba(155,122,203,0.09) 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          aria-hidden
        />

        <div className="container-shell relative z-10 pt-40 pb-24 md:pt-48 md:pb-28">
          {/* eyebrow badge */}
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8"
            style={{
              background: "rgba(200,155,60,0.13)",
              border: "1px solid rgba(200,155,60,0.32)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Sparkle className="h-3 w-3 text-gold-light" />
            <span className="text-[0.67rem] font-semibold uppercase tracking-[0.22em]" style={{ color: GOLD_LIGHT }}>
              {eyebrow}
            </span>
          </div>

          {/* breadcrumb */}
          <div className="mb-7">
            <Breadcrumb
              light
              items={[
                { label: "Home", href: "/" },
                { label: eyebrow },
              ]}
            />
          </div>

          {/* headline */}
          <h1
            className="font-display font-semibold leading-[1.06] tracking-tight text-ivory text-balance"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)", maxWidth: "860px" }}
          >
            {title}{" "}
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
              {highlight}
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
            className="max-w-[620px] leading-[1.85] text-pretty"
            style={{ fontSize: "1.08rem", color: "rgba(255,253,248,0.65)", letterSpacing: "0.012em" }}
          >
            {description}
          </p>

          {/* last updated pill */}
          <div className="mt-9 inline-flex items-center gap-2.5 rounded-full pl-2 pr-5 py-2" style={{ background: "rgba(255,253,248,0.05)", border: "1px solid rgba(200,155,60,0.22)" }}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
              <svg className="h-3 w-3 text-navy-dark" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em]" style={{ color: GOLD_LIGHT }}>
              Last updated · {lastUpdated}
            </span>
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <section
        className="relative section-pad overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(200,155,60,0.025) 0%, #faf8f3 10%)" }}
        aria-label={`${eyebrow} content`}
      >
        {/* ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[260px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(200,155,60,0.05) 0%, transparent 70%)", filter: "blur(48px)" }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-16 items-start">
            {/* ── Sidebar TOC ── */}
            <aside className="lg:sticky lg:top-28">
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "rgba(255,253,248,0.96)",
                  border: "1px solid rgba(200,155,60,0.14)",
                  boxShadow: "0 8px 40px rgba(23,32,51,0.07)",
                }}
              >
                <div
                  className="px-6 py-4 flex items-center gap-3"
                  style={{
                    background: "linear-gradient(135deg, rgba(200,155,60,0.09) 0%, rgba(200,155,60,0.03) 100%)",
                    borderBottom: "1px solid rgba(200,155,60,0.10)",
                  }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `linear-gradient(135deg, ${NAVY}, #22304d)` }}>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill={GOLD_LIGHT} aria-hidden>
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD_DARK }}>
                    On this page
                  </span>
                </div>

                <nav aria-label="Table of contents" className="p-3">
                  <ul className="space-y-0.5">
                    {sections.map((section, i) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-warmWhite"
                        >
                          <span
                            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[0.62rem] font-bold transition-colors duration-200"
                            style={{
                              background: "rgba(200,155,60,0.10)",
                              color: GOLD_DARK,
                              border: "1px solid rgba(200,155,60,0.18)",
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[0.83rem] font-medium leading-snug" style={{ color: NAVY }}>
                            {section.title}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* ── Sections ── */}
            <div className="space-y-6">
              {sections.map((section, i) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="relative rounded-3xl overflow-hidden scroll-mt-28"
                  style={{
                    background: "rgba(255,253,248,0.97)",
                    border: "1px solid rgba(200,155,60,0.12)",
                    boxShadow: "0 4px 24px rgba(23,32,51,0.06)",
                  }}
                >
                  {/* top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} aria-hidden />

                  <div className="p-7 md:p-9">
                    <div className="flex items-start gap-4">
                      <span
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl font-display text-[1rem] font-bold select-none"
                        style={{
                          background: `linear-gradient(145deg, rgba(200,155,60,0.16), rgba(200,155,60,0.05))`,
                          border: "1px solid rgba(200,155,60,0.25)",
                          color: GOLD,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="pt-0.5">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: GOLD_DARK }}>
                          Section {String(i + 1).padStart(2, "0")}
                        </p>
                        <h2 className="font-display text-[1.28rem] font-semibold leading-snug" style={{ color: NAVY }}>
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4 text-[0.95rem] leading-[1.85] text-mutedText text-pretty [&_p]:mb-4 [&_p]:last:mb-0">
                      {section.content}
                    </div>
                  </div>
                </article>
              ))}

              {/* ── Bottom CTA ── */}
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{
                  background: `linear-gradient(148deg, ${NAVY_DARK} 0%, ${NAVY} 100%)`,
                  border: "1px solid rgba(200,155,60,0.18)",
                  boxShadow: "0 8px 48px rgba(23,32,51,0.18)",
                }}
              >
                <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(200,155,60,0.16) 0%, transparent 70%)`, filter: "blur(24px)" }} aria-hidden />
                <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(155,122,203,0.10) 0%, transparent 70%)`, filter: "blur(20px)" }} aria-hidden />

                <div className="relative z-10 p-8 md:p-10 text-center">
                  <div className="flex items-center justify-center gap-3 mb-5" aria-hidden>
                    <div style={{ height: "1px", width: "40px", background: `linear-gradient(90deg, transparent, ${GOLD}66)` }} />
                    <Sparkle className="h-3 w-3 text-gold-light" />
                    <div style={{ height: "1px", width: "40px", background: `linear-gradient(90deg, ${GOLD}66, transparent)` }} />
                  </div>
                  <h2 className="font-display text-[1.5rem] font-semibold text-ivory leading-snug" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                    {ctaTitle}
                  </h2>
                  <p className="mt-3 text-[0.95rem] leading-relaxed mx-auto max-w-md" style={{ color: "rgba(255,253,248,0.62)" }}>
                    We&rsquo;re happy to answer any questions you have about how your data is handled.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/contact"
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl px-7 py-3.5 font-semibold text-[0.92rem] transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD_LIGHT} 30%, ${GOLD} 60%, #a67f2e 100%)`,
                        boxShadow: `0 0 28px rgba(200,155,60,0.4)`,
                        color: NAVY_DARK,
                      }}
                    >
                      <span
                        className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.26), transparent)" }}
                        aria-hidden
                      />
                      Contact Us
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-semibold text-[0.92rem] transition-all duration-300 hover:-translate-y-0.5"
                      style={{ border: "1px solid rgba(255,253,248,0.16)", color: "rgba(255,253,248,0.78)", background: "rgba(255,255,255,0.04)" }}
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}