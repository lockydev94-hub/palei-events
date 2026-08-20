import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { footerColumns, site } from "@/data/site";

const GOLD = "#c89b3c";
const GOLD_LIGHT = "#e0c584";
const GOLD_PALE = "#f5dfa0";
const NAVY_DARK = "#0f1522";

function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden style={style}>
      <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/91${site.phone}`,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${NAVY_DARK} 0%, #080d16 100%)` }}
      aria-label="Site footer"
    >
      {/* ── Background decorations ── */}
      {/* Gold bloom top left */}
      <div
        className="absolute -top-32 -left-32 pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,155,60,0.09) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      {/* Purple accent bottom right */}
      <div
        className="absolute -bottom-24 -right-24 pointer-events-none"
        style={{
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,122,203,0.07) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        aria-hidden
      />
      {/* Top gold border line */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)` }}
        aria-hidden
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${GOLD_LIGHT} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <Container className="relative z-10 pt-16 pb-10 md:pt-20">
        {/* ── Main grid ── */}
        <div className="grid gap-14 lg:grid-cols-[1.5fr_2fr]">

          {/* Left — brand + contact */}
          <div className="max-w-[340px]">
            <Logo />

            {/* Tagline */}
            <p
              className="mt-5 text-[0.9rem] leading-[1.82]"
              style={{ color: "rgba(255,253,248,0.55)" }}
            >
              {site.tagline} A digital event experience platform for weddings, birthdays,
              corporate events, schools, colleges and every celebration in between.
            </p>
            <p
              className="mt-3 font-display text-[0.88rem] italic"
              style={{ color: "rgba(200,155,60,0.70)" }}
            >
              {site.supporting}
            </p>

            {/* Ornament */}
            <div className="flex items-center gap-3 my-6" aria-hidden>
              <div style={{ height: "1px", width: "40px", background: `linear-gradient(90deg, transparent, ${GOLD}50)` }} />
              <Sparkle className="h-2.5 w-2.5" style={{ color: `${GOLD}70` } as React.CSSProperties} />
              <div style={{ height: "1px", width: "40px", background: `linear-gradient(90deg, ${GOLD}50, transparent)` }} />
            </div>

            {/* Contact info block */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,253,248,0.04)",
                border: "1px solid rgba(200,155,60,0.16)",
              }}
            >
              {[
                {
                  icon: (
                    <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  ),
                  label: site.phone,
                  href: `tel:${site.phone}`,
                },
                {
                  icon: (
                    <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  ),
                  label: site.email,
                  href: `mailto:${site.email}`,
                },
                {
                  icon: (
                    <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  ),
                  label: site.address,
                  href: `https://maps.google.com/?q=${encodeURIComponent(site.address)}`,
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-3 px-4 py-3 transition-colors duration-200 group"
                  style={{ borderBottom: i < 2 ? "1px solid rgba(200,155,60,0.09)" : undefined }}
                >
                  <span
                    className="mt-0.5 transition-colors duration-200"
                    style={{ color: GOLD }}
                  >
                    {item.icon}
                  </span>
                  <span
                    className="text-[0.80rem] leading-relaxed transition-colors duration-200 group-hover:text-ivory"
                    style={{ color: "rgba(255,253,248,0.52)" }}
                  >
                    {item.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255,253,248,0.05)",
                    border: "1px solid rgba(255,253,248,0.12)",
                    color: "rgba(255,253,248,0.45)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                {/* column header */}
                <div className="flex items-center gap-2 mb-5">
                  <div
                    style={{
                      height: "1px", width: "16px",
                      background: `linear-gradient(90deg, transparent, ${GOLD}60)`,
                    }}
                    aria-hidden
                  />
                  <h3
                    className="text-[0.65rem] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: GOLD_LIGHT }}
                  >
                    {column.title}
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-[0.83rem] transition-all duration-200"
                        style={{ color: "rgba(255,253,248,0.50)" }}
                      >
                        <span
                          className="inline-block w-0 group-hover:w-2.5 overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100"
                          style={{ color: GOLD, fontSize: "0.55rem" }}
                          aria-hidden
                        >
                          ▶
                        </span>
                        <span className="group-hover:text-ivory transition-colors duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Newsletter / CTA strip ── */}
        <div
          className="mt-14 rounded-2xl px-7 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between"
          style={{
            background: "linear-gradient(135deg, rgba(200,155,60,0.10) 0%, rgba(200,155,60,0.04) 100%)",
            border: "1px solid rgba(200,155,60,0.20)",
          }}
        >
          <div>
            <p
              className="font-display text-[0.98rem] font-semibold"
              style={{ color: "#fffdf8" }}
            >
              Ready to create your event?
            </p>
            <p className="text-[0.78rem] mt-0.5" style={{ color: "rgba(255,253,248,0.45)" }}>
              Join 10,000+ event creators across India using Palei Events.
            </p>
          </div>
          <Link
            href="/create-event"
            className="group relative flex-shrink-0 inline-flex items-center gap-2 overflow-hidden rounded-xl px-6 py-2.5 font-semibold text-[0.88rem] transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD_LIGHT} 30%, ${GOLD} 60%, #a67f2e 100%)`,
              boxShadow: `0 0 28px rgba(200,155,60,0.40)`,
              color: NAVY_DARK,
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
              aria-hidden
            />
            <Sparkle className="h-3 w-3" />
            Create Your Event
          </Link>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-10 pt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
          style={{ borderTop: "1px solid rgba(255,253,248,0.07)" }}
        >
          <p className="text-[0.75rem]" style={{ color: "rgba(255,253,248,0.35)" }}>
            © {new Date().getFullYear()} Palei Events. All rights reserved. Made with care in{" "}
            <span style={{ color: "rgba(255,253,248,0.55)" }}>Bhubaneswar, Odisha</span>.
          </p>

          <div className="flex items-center gap-4">
            {/* Legal links */}
            <div className="flex items-center gap-3 text-[0.73rem]" style={{ color: "rgba(255,253,248,0.30)" }}>
              <Link href="/privacy" className="hover:text-ivory transition-colors duration-200" style={{ color: "rgba(255,253,248,0.30)" }}>
                Privacy
              </Link>
              <span aria-hidden>·</span>
              <Link href="/terms" className="hover:text-ivory transition-colors duration-200" style={{ color: "rgba(255,253,248,0.30)" }}>
                Terms
              </Link>
            </div>

            {/* Developer credit */}
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                background: "rgba(255,253,248,0.04)",
                border: "1px solid rgba(255,253,248,0.09)",
              }}
            >
              <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill={GOLD} aria-hidden>
                <path d="M6 0L7.5 4.5H12L8.25 7.25L9.75 12L6 9.25L2.25 12L3.75 7.25L0 4.5H4.5L6 0Z" />
              </svg>
              <span className="text-[0.68rem]" style={{ color: "rgba(255,253,248,0.28)" }}>
                Crafted by{" "}
                <a
                  href="https://www.lockydev.cloud/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Locky Dev — Web App, Software & Digital Marketing Services"
                  className="font-semibold transition-colors duration-200 hover:underline"
                  style={{ color: GOLD_LIGHT }}
                >
                  Locky Dev
                </a>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
