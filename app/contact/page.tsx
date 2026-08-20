import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Palei Events — call 9437739550, email paleievents.service@gmail.com, or visit us at 101, Avinue Apartment, Gothapatana, Bhubaneswar, Odisha-751003.",
  alternates: { canonical: "/contact" },
};

const NAVY = "#172033";
const NAVY_DARK = "#0f1522";
const GOLD = "#c89b3c";
const GOLD_LIGHT = "#e0c584";
const GOLD_PALE = "#f5dfa0";
const GOLD_DARK = "#a67f2e";

/* ── Sparkle ────────────────────────────────────────────────── */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
    </svg>
  );
}

/* ── Page Hero ──────────────────────────────────────────────── */
function ContactHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${NAVY_DARK} 0%, ${NAVY} 100%)` }}
      aria-label="Contact Palei Events"
    >
      {/* fine dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${GOLD_LIGHT} 1px, transparent 0)`,
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black, transparent)",
        }}
        aria-hidden
      />
      {/* gold bloom upper right */}
      <div
        className="absolute -top-40 -right-40 pointer-events-none"
        style={{
          width: 580,
          height: 580,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,155,60,0.18) 0%, rgba(200,155,60,0.05) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      {/* purple depth lower left */}
      <div
        className="absolute -bottom-20 -left-20 pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(155,122,203,0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        aria-hidden
      />
      {/* faint grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,155,60,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,155,60,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, black, transparent)",
        }}
        aria-hidden
      />
      {/* diagonal light beam */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          right: "30%",
          width: "1px",
          height: "60%",
          background:
            "linear-gradient(to bottom, transparent, rgba(200,155,60,0.20) 40%, rgba(200,155,60,0.08) 70%, transparent)",
          transform: "rotate(-15deg)",
          filter: "blur(1px)",
        }}
        aria-hidden
      />

      <div className="container-shell relative z-10 pt-44 pb-32 md:pt-52 md:pb-36">

        {/* eyebrow badge */}
        <div
          className="inline-flex items-center gap-2.5 rounded-full pl-2 pr-5 py-2 mb-9"
          style={{
            background: "rgba(200,155,60,0.12)",
            border: "1px solid rgba(200,155,60,0.30)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 24px rgba(200,155,60,0.10)",
          }}
        >
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span
              className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-20"
              style={{ background: GOLD }}
            />
            <span
              className="relative inline-flex h-3 w-3 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${GOLD_PALE}, ${GOLD})`,
                boxShadow: "0 0 8px rgba(200,155,60,0.6)",
              }}
            />
          </span>
          <span
            className="text-[0.67rem] font-semibold uppercase tracking-[0.22em]"
            style={{ color: GOLD_LIGHT }}
          >
            Contact us
          </span>
          <Sparkle className="h-3 w-3 text-gold-light/50" />
        </div>

        {/* breadcrumb */}
        <div className="mb-7">
          <Breadcrumb
            light
            items={[
              { label: "Home", href: "/" },
              { label: "Contact" },
            ]}
          />
        </div>

        {/* headline */}
        <h1
          className="font-display font-semibold leading-[1.06] tracking-tight text-ivory text-balance"
          style={{ fontSize: "clamp(2.8rem, 5.8vw, 4.8rem)", maxWidth: "820px" }}
        >
          Let&rsquo;s talk about{" "}
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
            your event
          </span>
        </h1>

        {/* accent bar */}
        <div
          className="mt-8 mb-7"
          style={{
            height: "2px",
            width: "60px",
            background: `linear-gradient(90deg, ${GOLD}, rgba(200,155,60,0.18))`,
            borderRadius: "2px",
          }}
          aria-hidden
        />

        {/* sub-copy */}
        <p
          className="max-w-[560px] leading-[1.88] text-pretty"
          style={{
            fontSize: "1.08rem",
            color: "rgba(255,253,248,0.60)",
            letterSpacing: "0.013em",
          }}
        >
          A question about a plan, a partnership, or an upcoming celebration —{" "}
          <span style={{ color: "rgba(255,253,248,0.85)", fontStyle: "italic" }}>
            we&rsquo;d love to hear from you.
          </span>
        </p>

        {/* quick-info row */}
        <div className="mt-12 flex flex-wrap items-center gap-6">
          {[
            {
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill={GOLD} aria-hidden>
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              ),
              label: "paleievents.service@gmail.com",
            },
            {
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill={GOLD} aria-hidden>
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              ),
              label: "9437739550",
            },
            {
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill={GOLD} aria-hidden>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              ),
              label: "Reply within 24 hours",
            },
            {
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill={GOLD} aria-hidden>
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              ),
              label: "101, Avinue Apartment, Gothapatana,\nBhubaneswar, Odisha-751003",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5"
              style={{ color: "rgba(255,253,248,0.52)" }}
            >
              {item.icon}
              <span className="text-[0.84rem] font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Sidebar contact info card ──────────────────────────────── */
function ContactInfoCard() {
  const items = [
    {
      icon: (
        <svg className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      label: "Email",
      value: "paleievents.service@gmail.com",
      href: "mailto:paleievents.service@gmail.com",
    },
    {
      icon: (
        <svg className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      ),
      label: "Phone",
      value: "9437739550",
      href: "tel:9437739550",
    },
    {
      icon: (
        <svg className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      label: "Address",
      value: "101, Avinue Apartment, Gothapatana, Bhubaneswar, Odisha-751003",
      href: "https://maps.google.com/?q=101+Avinue+Apartment+Gothapatana+Bhubaneswar",
    },
  ];

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "rgba(255,253,248,0.98)",
        border: "1px solid rgba(200,155,60,0.13)",
        boxShadow:
          "0 8px 48px rgba(23,32,51,0.07), 0 0 0 0.5px rgba(200,155,60,0.08)",
      }}
    >
      {/* header */}
      <div
        className="px-7 py-5 flex items-center gap-3.5"
        style={{
          background:
            "linear-gradient(135deg, rgba(200,155,60,0.09), rgba(200,155,60,0.03))",
          borderBottom: "1px solid rgba(200,155,60,0.10)",
        }}
      >
        <div
          className="flex items-center justify-center h-11 w-11 rounded-2xl flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${NAVY}, #22304d)` }}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill={GOLD_LIGHT} aria-hidden>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p
            className="text-[0.61rem] font-semibold uppercase tracking-[0.22em] mb-0.5"
            style={{ color: GOLD_DARK }}
          >
            Get in touch
          </p>
          <h2
            className="font-display text-[1.05rem] font-semibold leading-none"
            style={{ color: NAVY }}
          >
            Contact details
          </h2>
        </div>
      </div>

      <div className="px-7 pt-3 pb-6 divide-y" style={{ borderColor: "rgba(200,155,60,0.09)" }}>
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-4 py-4">
            <div
              className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl mt-0.5"
              style={{
                background:
                  "linear-gradient(145deg, rgba(200,155,60,0.14), rgba(200,155,60,0.06))",
                border: "1px solid rgba(200,155,60,0.20)",
                color: GOLD,
              }}
            >
              {item.icon}
            </div>
            <div className="min-w-0">
              <p
                className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] mb-1"
                style={{ color: GOLD_DARK }}
              >
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-[0.9rem] font-medium hover:underline transition-colors duration-200"
                  style={{ color: NAVY }}
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-[0.9rem] font-medium" style={{ color: NAVY }}>
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Explore card ───────────────────────────────────────────── */
function ExploreCard() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: `linear-gradient(148deg, ${NAVY_DARK} 0%, ${NAVY} 100%)`,
        border: "1px solid rgba(200,155,60,0.18)",
        boxShadow: "0 8px 48px rgba(23,32,51,0.18)",
      }}
    >
      {/* ambient glow inside */}
      <div
        className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(200,155,60,0.16) 0%, transparent 70%)`,
          filter: "blur(24px)",
        }}
        aria-hidden
      />
      <div
        className="absolute -top-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(155,122,203,0.10) 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 p-7">
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-5"
          style={{
            background: "rgba(200,155,60,0.12)",
            border: "1px solid rgba(200,155,60,0.25)",
          }}
        >
          <Sparkle className="h-2.5 w-2.5 text-gold-light" />
          <span
            className="text-[0.62rem] font-semibold uppercase tracking-[0.2em]"
            style={{ color: GOLD_LIGHT }}
          >
            Explore first
          </span>
        </div>

        <h2
          className="font-display text-[1.12rem] font-semibold text-ivory leading-snug mb-3"
        >
          Prefer to explore before reaching out?
        </h2>
        <p
          className="text-[0.86rem] leading-relaxed mb-7"
          style={{ color: "rgba(255,253,248,0.58)" }}
        >
          Browse templates, see a live event in action, or jump right in and create.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/templates"
            className="group relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[0.88rem] font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD_LIGHT} 30%, ${GOLD} 60%, #a67f2e 100%)`,
              boxShadow: `0 0 24px rgba(200,155,60,0.35)`,
              color: NAVY_DARK,
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.26), transparent)",
              }}
              aria-hidden
            />
            Browse templates
          </Link>

          <Link
            href="/e/aarav-ananya-wedding"
            className="group flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[0.88rem] font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              border: "1px solid rgba(255,253,248,0.14)",
              color: "rgba(255,253,248,0.72)",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
            }}
          >
            View live demo
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link
            href="/create-event"
            className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[0.86rem] font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              border: "1px solid rgba(255,253,248,0.08)",
              color: "rgba(255,253,248,0.44)",
              background: "transparent",
            }}
          >
            Create an event
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── FAQ accordion ──────────────────────────────────────────── */
const faqs = [
  {
    q: "How quickly do you respond?",
    a: "Within 24 hours on business days. Often sooner.",
  },
  {
    q: "Can I get a demo before signing up?",
    a: "Yes — visit /e/aarav-ananya-wedding to see a live event page in action.",
  },
  {
    q: "Do you offer custom plans?",
    a: "Reach out and we'll tailor a plan that fits your event volume and needs.",
  },
];

function FaqCard() {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "rgba(255,253,248,0.98)",
        border: "1px solid rgba(200,155,60,0.11)",
        boxShadow: "0 4px 28px rgba(23,32,51,0.06)",
      }}
    >
      {/* header */}
      <div
        className="px-7 py-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(200,155,60,0.07), rgba(200,155,60,0.02))",
          borderBottom: "1px solid rgba(200,155,60,0.09)",
        }}
      >
        <p
          className="text-[0.61rem] font-semibold uppercase tracking-[0.22em] mb-0.5"
          style={{ color: GOLD_DARK }}
        >
          Quick answers
        </p>
        <h2
          className="font-display text-[1rem] font-semibold leading-none"
          style={{ color: NAVY }}
        >
          FAQs
        </h2>
      </div>

      <div className="divide-y px-7" style={{ borderColor: "rgba(200,155,60,0.07)" }}>
        {faqs.map((faq) => (
          <div key={faq.q} className="py-4">
            <div className="flex items-start gap-3">
              <span
                className="flex-shrink-0 mt-0.5 flex items-center justify-center h-5 w-5 rounded-full text-[0.6rem] font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,155,60,0.18), rgba(200,155,60,0.08))",
                  border: "1px solid rgba(200,155,60,0.22)",
                  color: GOLD_DARK,
                }}
              >
                Q
              </span>
              <div>
                <p
                  className="text-[0.88rem] font-semibold leading-snug mb-1.5"
                  style={{ color: NAVY }}
                >
                  {faq.q}
                </p>
                <p
                  className="text-[0.82rem] leading-relaxed"
                  style={{ color: "rgba(23,32,51,0.56)" }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section
        className="relative section-pad overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(200,155,60,0.022) 0%, #faf8f3 10%)",
        }}
        aria-label="Contact form and information"
      >
        {/* top ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[280px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(200,155,60,0.055) 0%, transparent 70%)",
            filter: "blur(48px)",
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-16 items-start">

            {/* LEFT — form */}
            <div>
              <ContactForm />
            </div>

            {/* RIGHT — sidebar */}
            <aside className="space-y-5 lg:pt-1">
              <ContactInfoCard />
              <ExploreCard />
              <FaqCard />
            </aside>

          </div>
        </Container>
      </section>
    </>
  );
}
