"use client";

import Image from "next/image";
import { useState } from "react";
import { BrowserFrame } from "./BrowserFrame";

/* ─── Tab data ──────────────────────────────────────────────── */
const tabs = [
  { label: "Event Details", icon: "📄", key: "details" },
  { label: "Schedule",      icon: "🕐", key: "schedule" },
  { label: "Gallery",       icon: "📸", key: "gallery"  },
  { label: "RSVP",          icon: "💌", key: "rsvp"     },
  { label: "Guest Wishes",  icon: "💬", key: "wishes"   },
] as const;

type TabKey = (typeof tabs)[number]["key"];

/* ─── Tab content for BROWSER view ─────────────────────────── */
function BrowserTabContent({ active }: { active: TabKey }) {
  if (active === "details") {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <span className="text-3xl">📍</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Venue</p>
            <p className="mt-1 text-sm font-semibold text-navy">Bhubaneswar Convention Centre, Hall A</p>
            <p className="text-xs text-mutedText mt-0.5">Janpath Road, Bhubaneswar · 751022</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-3xl">📅</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Date & Time</p>
            <p className="mt-1 text-sm font-semibold text-navy">December 14, 2026 · 10:00 AM onwards</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-3xl">💌</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Dress Code</p>
            <p className="mt-1 text-sm font-semibold text-navy">Traditional or Formal Attire</p>
          </div>
        </div>
      </div>
    );
  }
  if (active === "schedule") {
    const items = [
      { time: "10:00 AM", event: "Guest Arrival & Welcome Drinks" },
      { time: "11:00 AM", event: "Wedding Ceremony" },
      { time: "01:00 PM", event: "Photography & Video Session" },
      { time: "02:00 PM", event: "Reception Lunch" },
      { time: "05:00 PM", event: "Cultural Programme & Dance" },
      { time: "08:00 PM", event: "Dinner & Celebrations" },
    ];
    return (
      <div className="p-6 space-y-3">
        {items.map((item) => (
          <div key={item.time} className="flex items-center gap-4">
            <span className="w-20 shrink-0 text-xs font-bold text-gold-dark tabular-nums">{item.time}</span>
            <div className="flex-1 rounded-lg bg-champagne/30 px-3 py-2">
              <p className="text-xs font-semibold text-navy">{item.event}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (active === "gallery") {
    return (
      <div className="p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">Event Gallery</p>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-champagne/40 flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-mutedText text-center">Guests can upload photos · Gallery goes live on event day</p>
      </div>
    );
  }
  if (active === "rsvp") {
    return (
      <div className="p-6 space-y-4 max-w-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Confirm Attendance</p>
        <div className="space-y-2">
          <input className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm placeholder:text-mutedText/60 focus:outline-none focus:ring-2 focus:ring-gold/40" placeholder="Your name" readOnly />
          <input className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm placeholder:text-mutedText/60 focus:outline-none focus:ring-2 focus:ring-gold/40" placeholder="Phone number" readOnly />
        </div>
        <div className="flex gap-3">
          <button className="flex-1 rounded-xl bg-gold py-2.5 text-sm font-semibold text-navy-dark">✓ Attending</button>
          <button className="flex-1 rounded-xl border border-navy/15 py-2.5 text-sm font-medium text-navy/60">✗ Can't Make It</button>
        </div>
      </div>
    );
  }
  // wishes
  const wishes = [
    { name: "Priya S.", msg: "Wishing you a lifetime of love and laughter! ✨", relation: "Friend" },
    { name: "Rohan M.", msg: "So happy for both of you! May your journey be magical.", relation: "Colleague" },
    { name: "Ananya K.", msg: "The perfect couple! Congratulations! 🎉", relation: "Family" },
  ];
  return (
    <div className="p-6 space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-4">Guest Wishes</p>
      {wishes.map((w) => (
        <div key={w.name} className="rounded-xl border border-navy/10 bg-champagne/20 p-4">
          <p className="text-sm italic text-navy/80">&ldquo;{w.msg}&rdquo;</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/25 text-xs font-bold text-gold-dark">{w.name[0]}</span>
            <span className="text-xs font-semibold text-navy/70">{w.name}</span>
            <span className="text-xs text-mutedText">· {w.relation}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Tab content for MOBILE view ───────────────────────────── */
function MobileTabContent({ active }: { active: TabKey }) {
  if (active === "details") {
    return (
      <div className="space-y-3 p-4">
        <div className="rounded-xl bg-gray-50 px-3 py-2.5 flex items-center gap-2">
          <span className="text-base">📍</span>
          <div>
            <p className="text-[9px] font-bold text-gold-dark uppercase tracking-wider">Venue</p>
            <p className="text-[10px] font-semibold text-navy mt-0.5">Bhubaneswar Convention Centre</p>
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5 flex items-center gap-2">
          <span className="text-base">📅</span>
          <div>
            <p className="text-[9px] font-bold text-gold-dark uppercase tracking-wider">Date</p>
            <p className="text-[10px] font-semibold text-navy mt-0.5">Dec 14, 2026 · 10:00 AM</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 rounded-xl py-2 text-[9px] font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg,#c89b3c,#e0c584)" }}>RSVP</button>
          <button className="flex-1 rounded-xl border border-navy/20 py-2 text-[9px] font-semibold text-navy/70">Share</button>
        </div>
      </div>
    );
  }
  if (active === "schedule") {
    const items = [
      { time: "10 AM", event: "Guest Arrival" },
      { time: "11 AM", event: "Ceremony" },
      { time: "1 PM", event: "Photography" },
      { time: "2 PM", event: "Lunch" },
      { time: "8 PM", event: "Dinner" },
    ];
    return (
      <div className="p-4 space-y-2">
        {items.map((item) => (
          <div key={item.time} className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-[9px] font-bold text-gold-dark">{item.time}</span>
            <div className="flex-1 rounded-lg bg-champagne/30 px-2 py-1.5">
              <p className="text-[9px] font-semibold text-navy">{item.event}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (active === "gallery") {
    return (
      <div className="p-4">
        <p className="text-[9px] font-bold uppercase tracking-widest text-gold-dark mb-2">Gallery</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-champagne/40 flex items-center justify-center">
              <span className="text-base">📸</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (active === "rsvp") {
    return (
      <div className="p-4 space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-widest text-gold-dark">RSVP</p>
        <input className="w-full rounded-lg border border-navy/15 px-2 py-1.5 text-[9px] placeholder:text-mutedText/50" placeholder="Your name" readOnly />
        <input className="w-full rounded-lg border border-navy/15 px-2 py-1.5 text-[9px] placeholder:text-mutedText/50" placeholder="Phone" readOnly />
        <button className="w-full rounded-xl py-2 text-[9px] font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg,#c89b3c,#e0c584)" }}>Confirm Attendance</button>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-gold-dark">Wishes</p>
      {[
        { name: "Priya S.", msg: "Wishing you a lifetime of happiness! ✨" },
        { name: "Rohan M.", msg: "So happy for both of you! 🎉" },
      ].map((w) => (
        <div key={w.name} className="rounded-lg border border-navy/10 bg-champagne/20 p-2.5">
          <p className="text-[9px] italic text-navy/80">&ldquo;{w.msg}&rdquo;</p>
          <p className="mt-1 text-[8px] font-semibold text-gold-dark">— {w.name}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Premium Mobile Shell ───────────────────────────────────── */
function PremiumMobileFrame({
  activeTab,
  onTabChange,
}: {
  activeTab: TabKey;
  onTabChange: (key: TabKey) => void;
}) {
  return (
    /* Increased width: was 260px, now 300px for large screens */
    <div className="relative hidden lg:flex flex-col" style={{ width: 300 }}>
      {/* Glow aura */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[3rem] blur-2xl opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(200,155,60,0.45) 0%, rgba(200,155,60,0.1) 60%, transparent 80%)",
        }}
        aria-hidden
      />

      {/* Outer shell */}
      <div
        className="relative flex flex-col overflow-hidden rounded-[2.75rem] shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #2a3347 0%, #151c2e 100%)",
          padding: "3px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Screen */}
        <div
          className="relative flex flex-col overflow-hidden rounded-[2.5rem] bg-[#0f1420]"
          style={{ minHeight: 560 }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3.5 pb-1 shrink-0">
            <span className="text-[9px] font-semibold text-white/50 tabular-nums">9:41</span>
            <div className="h-4 w-16 rounded-full bg-black flex items-center justify-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#1a1a1a]" />
              <span className="h-1 w-5 rounded-full bg-[#1a1a1a]" />
            </div>
            <div className="flex items-center gap-1 text-white/50">
              <svg className="h-2.5 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
              <svg className="h-2.5 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden><rect x="2" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M22 11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative overflow-hidden shrink-0" style={{ height: 160 }}>
            <Image
              src="/animation/Floating Confetti.gif"
              alt="Event preview"
              fill
              sizes="300px"
              unoptimized
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(10,15,28,0.2) 0%, rgba(10,15,28,0.72) 100%)" }}
            />
            <div className="absolute inset-x-0 bottom-0 px-5 pb-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-champagne/80">Wedding · Dec 14, 2026</p>
              <h4 className="mt-0.5 font-display text-base font-semibold text-ivory leading-tight">Aarav &amp; Ananya</h4>
            </div>
          </div>

          {/* Content area — white card */}
          <div
            className="relative flex flex-col rounded-t-[1.5rem] bg-white flex-1 overflow-hidden"
            style={{ marginTop: -14 }}
          >
            {/* Scrollable content zone */}
            <div className="flex-1 overflow-y-auto">
              <MobileTabContent active={activeTab} />
            </div>

            {/* Bottom nav — always visible, clickable */}
            <div className="shrink-0 flex items-center justify-around border-t border-gray-100 bg-white pt-2 pb-3 px-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`flex flex-col items-center gap-0.5 px-1 transition-all duration-200 ${
                    activeTab === tab.key ? "opacity-100 scale-105" : "opacity-40"
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span
                    className={`text-[7px] font-semibold ${
                      activeTab === tab.key ? "text-gold-dark" : "text-gray-400"
                    }`}
                  >
                    {tab.label.split(" ")[0]}
                  </span>
                  {activeTab === tab.key && (
                    <span className="mt-0.5 h-0.5 w-4 rounded-full bg-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Home indicator */}
      <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-white/20" aria-hidden />
    </div>
  );
}

/* ─── Main Export ─────────────────────────────────────────────── */
export function EventExperiencePreview() {
  const [activeTab, setActiveTab] = useState<TabKey>("details");

  return (
    <div className="relative mx-auto mt-16 max-w-6xl">
      <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-14 lg:items-end">

        {/* Browser mockup */}
        <BrowserFrame className="w-full max-w-3xl">
          <div className="flex flex-col" style={{ minHeight: 400 }}>
            {/* Fixed hero area */}
            <div className="relative overflow-hidden" style={{ height: 240 }}>
              <Image
                src="/full-width-animation/PE-BG-01-golden-odisha.gif"
                alt="Demo wedding event hero"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
                  Wedding Event
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-ivory sm:text-4xl">
                  Aarav &amp; Ananya
                </h3>
                <p className="mt-1 text-sm text-ivory/80">
                  The Beginning of Forever · December 14, 2026
                </p>
              </div>
            </div>

            {/* Clickable nav tabs */}
            <div className="grid grid-cols-5 border-t border-navy/10 bg-ivory">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-col items-center gap-1 border-r border-navy/10 py-3.5 last:border-r-0 transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-gold/8 text-gold-dark"
                      : "hover:bg-champagne/20 text-mutedText"
                  }`}
                >
                  <span aria-hidden className="text-lg">{tab.icon}</span>
                  <span className={`text-[0.65rem] font-semibold ${activeTab === tab.key ? "text-gold-dark" : "text-mutedText"}`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.key && (
                    <span className="h-0.5 w-6 rounded-full bg-gold" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content area */}
            <div className="bg-ivory min-h-[160px]">
              <BrowserTabContent active={activeTab} />
            </div>
          </div>
        </BrowserFrame>

        {/* Premium mobile mockup — shared state */}
        <PremiumMobileFrame activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
