"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { site } from "@/data/site";

/* ─── Contact options ───────────────────────────────────────── */
const contacts = [
  {
    key: "call",
    label: "Call Us",
    sub: `+91 ${site.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.09 1.18 2 2 0 012.07.02h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    href: `tel:+91${site.phone}`,
    gradient: "from-[#172033] to-[#1e2d4a]",
    accent: "#c89b3c",
    badge: "24/7 Support",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    sub: "Chat instantly",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    href: `https://wa.me/91${site.phone}?text=Hi%20Palei%20Events%2C%20I%20need%20help%20with%20my%20event.`,
    gradient: "from-[#0a1f0a] to-[#1a3a1a]",
    accent: "#25D366",
    badge: "Fastest response",
  },
  {
    key: "email",
    label: "Email Us",
    sub: site.email,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
    href: `mailto:${site.email}`,
    gradient: "from-[#1a0f2e] to-[#2a1a4a]",
    accent: "#9b7acb",
    badge: "Reply in 2 hrs",
  },
] as const;

/* ─── Main Component ────────────────────────────────────────── */
export function ContactFloat() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Stop pulse after 6s
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3"
      aria-label="Contact options"
    >
      {/* ── Contact panel ─────────────────────────────────── */}
      <div
        className="flex flex-col gap-2.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        {/* Panel container */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(145deg, rgba(15,21,34,0.97) 0%, rgba(23,32,51,0.98) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(200,155,60,0.20)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
            width: 300,
          }}
        >
          {/* Decorative gold glow top-right */}
          <div
            className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(200,155,60,0.18) 0%, transparent 70%)" }}
            aria-hidden
          />

          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              {/* Animated logo mark */}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl font-display text-base font-bold text-champagne"
                style={{ background: "linear-gradient(135deg, rgba(200,155,60,0.25) 0%, rgba(200,155,60,0.10) 100%)", border: "1px solid rgba(200,155,60,0.30)" }}
              >
                P
              </div>
              <div>
                <p className="text-sm font-semibold text-ivory leading-tight">Get in Touch</p>
                <p className="text-[10px] text-ivory/45 mt-0.5">We&rsquo;re here to help you celebrate</p>
              </div>
            </div>

            {/* Online indicator */}
            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="text-[10px] font-medium text-green-400/80">Team online · Avg. reply 15 min</span>
            </div>
          </div>

          {/* Contact options */}
          <div className="p-3 flex flex-col gap-2">
            {contacts.map((c, i) => (
              <a
                key={c.key}
                href={c.href}
                target={c.key !== "call" ? "_blank" : undefined}
                rel={c.key !== "call" ? "noopener noreferrer" : undefined}
                className="group relative flex items-center gap-3.5 overflow-hidden rounded-xl px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${c.gradient.replace("from-[","").replace("]","").split(" to-[")[0]} 0%, ${c.gradient.split("to-[")[1].replace("]","")} 100%)`,
                  border: `1px solid ${c.accent}22`,
                  transitionDelay: `${i * 40}ms`,
                  boxShadow: `0 2px 12px ${c.accent}10`,
                }}
                onClick={() => setOpen(false)}
              >
                {/* Shine sweep on hover */}
                <div
                  className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"
                  style={{ background: `linear-gradient(105deg, transparent 40%, ${c.accent}18 50%, transparent 60%)` }}
                  aria-hidden
                />

                {/* Icon circle */}
                <div
                  className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${c.accent}20`, color: c.accent, border: `1px solid ${c.accent}30` }}
                >
                  {c.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ivory leading-tight">{c.label}</p>
                  <p className="text-[10px] text-ivory/50 mt-0.5 truncate">{c.sub}</p>
                </div>

                {/* Badge */}
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide"
                  style={{ background: `${c.accent}18`, color: c.accent, border: `1px solid ${c.accent}25` }}
                >
                  {c.badge}
                </span>

                {/* Arrow */}
                <svg className="shrink-0 h-3.5 w-3.5 text-ivory/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ivory/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
                </svg>
              </a>
            ))}
          </div>

          {/* Footer note */}
          <div className="px-5 pb-4 pt-1">
            <p className="text-center text-[9px] text-ivory/25 font-medium">
              Palei Events · Available Mon–Sat, 9 AM – 8 PM IST
            </p>
          </div>
        </div>
      </div>

      {/* ── FAB trigger button ────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact panel" : "Contact us"}
        aria-expanded={open}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        style={{
          background: open
            ? "linear-gradient(135deg, #172033 0%, #0f1522 100%)"
            : "linear-gradient(135deg, #c89b3c 0%, #e0c584 50%, #c89b3c 100%)",
          boxShadow: open
            ? "0 8px 32px rgba(23,32,51,0.6), 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 8px 32px rgba(200,155,60,0.5), 0 0 0 1px rgba(200,155,60,0.3)",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Pulse ring — shown when closed and pulsing */}
        {!open && pulse && (
          <>
            <span className="absolute inset-0 rounded-full bg-gold opacity-40 animate-ping" style={{ animationDuration: "2s" }} />
            <span className="absolute inset-0 rounded-full bg-gold opacity-20 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.4s" }} />
          </>
        )}

        {/* Hover glow ring */}
        <span
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle, rgba(200,155,60,0.25) 0%, transparent 70%)", transform: "scale(1.5)" }}
          aria-hidden
        />

        {/* Icon — morphs between chat and X */}
        <span className="relative z-10 transition-all duration-300" style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
          {open ? (
            /* X icon */
            <svg className="h-6 w-6 text-champagne" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            /* Chat bubble icon */
            <svg className="h-6 w-6 text-navy-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          )}
        </span>

        {/* "Contact Us" label that slides out on hover when closed */}
        {!open && (
          <span
            className="absolute right-full mr-3 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold text-navy-dark opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #e0c584 0%, #c89b3c 100%)",
              boxShadow: "0 4px 16px rgba(200,155,60,0.35)",
              transform: "translateX(6px)",
            }}
            aria-hidden
          >
            Contact Us
          </span>
        )}
      </button>
    </div>
  );
}
