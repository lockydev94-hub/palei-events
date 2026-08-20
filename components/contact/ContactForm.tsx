"use client";

import { useState } from "react";
import { eventCategories } from "@/data/events";

const NAVY = "#172033";
const NAVY_DARK = "#0f1522";
const GOLD = "#c89b3c";
const GOLD_LIGHT = "#e0c584";
const GOLD_PALE = "#f5dfa0";

/* ── Field wrapper ─────────────────────────────────────────── */
function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[0.78rem] font-semibold flex items-center gap-2"
        style={{ color: NAVY }}
      >
        {label}
        {optional && (
          <span
            className="text-[0.68rem] font-normal px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(23,32,51,0.06)",
              color: "rgba(23,32,51,0.45)",
            }}
          >
            optional
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl px-4 py-3.5 text-[0.9rem] placeholder:text-mutedText/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-gold/25 focus:border-gold/60";
const inputSty = {
  background: "rgba(255,253,248,0.85)",
  border: "1px solid rgba(23,32,51,0.10)",
  color: NAVY,
  boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 0 0 0 rgba(200,155,60,0)",
};

/* ── Success state ─────────────────────────────────────────── */
function SuccessState() {
  return (
    <div
      className="rounded-3xl p-14 text-center flex flex-col items-center"
      style={{
        background:
          "linear-gradient(145deg, rgba(200,155,60,0.06) 0%, rgba(147,168,138,0.04) 100%)",
        border: "1px solid rgba(200,155,60,0.15)",
        boxShadow: "0 12px 60px rgba(23,32,51,0.06)",
      }}
    >
      {/* animated check */}
      <div className="relative flex items-center justify-center h-24 w-24 mb-7">
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-10"
          style={{ background: GOLD }}
        />
        <div
          className="relative flex items-center justify-center h-24 w-24 rounded-full"
          style={{
            background:
              "linear-gradient(145deg, rgba(200,155,60,0.16), rgba(200,155,60,0.07))",
            border: "1.5px solid rgba(200,155,60,0.32)",
            boxShadow: "0 0 48px rgba(200,155,60,0.18)",
          }}
        >
          <svg
            className="h-10 w-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={GOLD}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>

      <h2
        className="font-display text-2xl font-semibold mb-3"
        style={{ color: NAVY }}
      >
        Message sent!
      </h2>
      <p
        className="text-[0.95rem] leading-relaxed max-w-xs"
        style={{ color: "rgba(23,32,51,0.6)" }}
      >
        We&rsquo;ll get back to you within{" "}
        <span className="font-semibold" style={{ color: NAVY }}>
          24 hours
        </span>
        . Thank you for reaching out.
      </p>

      <div className="flex justify-center gap-2 mt-8">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="inline-block h-1.5 rounded-full"
            style={{
              width: i === 1 ? "24px" : "6px",
              background:
                i === 1 ? GOLD : "rgba(200,155,60,0.22)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main form ─────────────────────────────────────────────── */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <SuccessState />;

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "rgba(255,253,248,0.98)",
        border: "1px solid rgba(200,155,60,0.13)",
        boxShadow:
          "0 16px 64px rgba(23,32,51,0.08), 0 0 0 0.5px rgba(200,155,60,0.10)",
      }}
    >
      {/* Header band */}
      <div
        className="px-8 py-5 flex items-center gap-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(200,155,60,0.10), rgba(200,155,60,0.04))",
          borderBottom: "1px solid rgba(200,155,60,0.11)",
        }}
      >
        <div
          className="flex items-center justify-center h-11 w-11 rounded-2xl flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${NAVY}, #22304d)`,
            boxShadow: "0 4px 16px rgba(10,15,28,0.2)",
          }}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill={GOLD_LIGHT}
            aria-hidden
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>
        <div>
          <p
            className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] mb-0.5"
            style={{ color: "#a67f2e" }}
          >
            Send a message
          </p>
          <h3
            className="font-display text-[1.08rem] font-semibold leading-none"
            style={{ color: NAVY }}
          >
            We&rsquo;d love to hear from you
          </h3>
        </div>
      </div>

      {/* Fields */}
      <form
        className="grid gap-5 p-8 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field label="Full name">
          <input
            id="contact-name"
            name="name"
            required
            placeholder="Your full name"
            className={inputCls}
            style={inputSty}
          />
        </Field>

        <Field label="Email address">
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputCls}
            style={inputSty}
          />
        </Field>

        <Field label="Phone number" optional>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="+91 ···"
            className={inputCls}
            style={inputSty}
          />
        </Field>

        <Field label="Event type">
          <select
            id="contact-event-type"
            name="eventType"
            defaultValue=""
            required
            className={inputCls}
            style={inputSty}
          >
            <option value="" disabled>
              Select an event type
            </option>
            {eventCategories.map((category) => (
              <option key={category.type} value={category.type}>
                {category.label}
              </option>
            ))}
            <option value="other">Something else</option>
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Your message">
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              placeholder="Tell us about your event, question, or idea…"
              className={`${inputCls} resize-none`}
              style={inputSty}
            />
          </Field>
        </div>

        {/* Footer row */}
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-1">
          <p
            className="text-[0.78rem] leading-relaxed flex items-center gap-1.5"
            style={{ color: "rgba(23,32,51,0.42)" }}
          >
            <svg
              className="h-3.5 w-3.5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Your information is safe with us
          </p>
          <button
            type="submit"
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-8 py-3.5 font-semibold text-[0.95rem] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            style={{
              background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD_LIGHT} 30%, ${GOLD} 65%, #a67f2e 100%)`,
              boxShadow: `0 0 32px rgba(200,155,60,0.40), 0 4px 16px rgba(0,0,0,0.16)`,
              color: NAVY_DARK,
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
              }}
              aria-hidden
            />
            <svg
              className="h-4 w-4 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}
