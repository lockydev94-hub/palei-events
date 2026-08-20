"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { site } from "@/data/site";

/* ── contact options ─────────────────────────────────────────── */
const contacts = [
  {
    id: "call",
    label: "Call Us",
    sub: `+91 ${site.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}`,
    href: `tel:+91${site.phone}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    color: "from-gold/20 to-gold/5",
    iconBg: "bg-gold/15",
    iconColor: "text-gold-light",
    hoverBg: "hover:bg-gold/10",
    badge: "bg-gold",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    sub: "Chat with us",
    href: `https://wa.me/91${site.phone}?text=Hi%2C%20I%20want%20to%20know%20more%20about%20Palei%20Events`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: "from-[#25D366]/20 to-[#25D366]/5",
    iconBg: "bg-[#25D366]/15",
    iconColor: "text-[#25D366]",
    hoverBg: "hover:bg-[#25D366]/10",
    badge: "bg-[#25D366]",
  },
  {
    id: "email",
    label: "Email Us",
    sub: site.email,
    href: `mailto:${site.email}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
      </svg>
    ),
    color: "from-purple/20 to-purple/5",
    iconBg: "bg-purple/15",
    iconColor: "text-purple",
    hoverBg: "hover:bg-purple/10",
    badge: "bg-purple",
  },
];

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  /* close on outside click */
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

  if (!mounted) return null;

  return (
    <div
      ref={panelRef}
      className="fixed bottom-20 right-4 z-[200] flex flex-col items-end gap-3 pointer-events-none sm:right-7 md:bottom-7"
      aria-live="polite"
    >
      {/* ── Contact panel ────────────────────────────────────── */}
      <div
        className="overflow-hidden rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          maxHeight: open ? "420px" : "0px",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          pointerEvents: open ? "auto" : "none",
          width: "288px",
          /* glass card */
          background: "linear-gradient(135deg, rgba(15,21,34,0.92) 0%, rgba(23,32,51,0.88) 100%)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(200,155,60,0.18), inset 0 1px 0 rgba(255,253,248,0.07)",
        }}
      >
        {/* Panel header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, #c89b3c, #e8d5a8)" }}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="#0f1522" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
                <path d="m7 8 3 2 3-2"/>
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-ivory leading-tight">Get in touch</p>
              <p className="text-[11px] text-ivory/45 leading-tight mt-0.5">We reply within a few hours</p>
            </div>
          </div>
        </div>

        {/* Contact items */}
        <div className="p-3 flex flex-col gap-1.5">
          {contacts.map((c, i) => (
            <a
              key={c.id}
              href={c.href}
              target={c.id !== "call" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-3 transition-all duration-200 ${c.hoverBg} hover:scale-[1.02]`}
              style={{
                animation: open ? `floatContactIn 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 70}ms both` : "none",
              }}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.iconBg} ${c.iconColor} transition-transform duration-200 group-hover:scale-110`}
              >
                {c.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ivory leading-tight">{c.label}</p>
                <p className="text-[11px] text-ivory/50 leading-tight mt-0.5 truncate">{c.sub}</p>
              </div>
              <span className="shrink-0 text-ivory/25 group-hover:text-ivory/60 transition-colors">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </span>
            </a>
          ))}
        </div>

        {/* Bottom note */}
        <div className="px-5 pb-4 pt-1">
          <p className="text-[10px] text-ivory/25 text-center">
            Mon–Sat · 9 AM – 7 PM IST
          </p>
        </div>
      </div>

      {/* ── Floating trigger button ───────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact menu" : "Contact us"}
        aria-expanded={open}
        className="group relative flex items-center gap-2.5 rounded-full px-5 py-3.5 text-sm font-semibold text-navy-dark select-none outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 pointer-events-auto"
        style={{
          background: "linear-gradient(135deg, #e8d5a8 0%, #c89b3c 60%, #a67f2e 100%)",
          boxShadow: open
            ? "0 8px 32px rgba(200,155,60,0.55), 0 0 0 4px rgba(200,155,60,0.15)"
            : "0 4px 24px rgba(200,155,60,0.4), 0 0 0 0px rgba(200,155,60,0)",
          transition: "box-shadow 0.35s ease, transform 0.2s ease",
        }}
      >
        {/* Pulse ring */}
        {!open && (
          <span
            className="absolute inset-0 rounded-full"
            style={{ animation: "contactPulse 2.4s ease-out infinite" }}
            aria-hidden
          />
        )}

        {/* Icon: toggle between chat & X */}
        <span
          className="relative flex h-5 w-5 items-center justify-center transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          {open ? (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
              <path d="M5 5l10 10M15 5L5 15"/>
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H9l-4 3V14H4a2 2 0 01-2-2V5z"/>
              <path d="M7 8h6M7 11h4"/>
            </svg>
          )}
        </span>

        <span
          className="overflow-hidden transition-all duration-300"
          style={{ maxWidth: open ? "0px" : "100px", opacity: open ? 0 : 1 }}
        >
          Contact Us
        </span>
      </button>

      {/* Inline keyframes */}
      <style>{`
        @keyframes contactPulse {
          0%   { box-shadow: 0 0 0 0 rgba(200,155,60,0.55); opacity: 1; }
          70%  { box-shadow: 0 0 0 16px rgba(200,155,60,0); opacity: 0; }
          100% { box-shadow: 0 0 0 0 rgba(200,155,60,0); opacity: 0; }
        }
        @keyframes floatContactIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
