"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface RSVPFormProps {
  /** Firestore event id — the page falls back to the demo id when offline. */
  eventId: string;
  /** uid of the event owner (stamped on each RSVP so the owner can read them). */
  ownerId?: string;
  eventName: string;
}

export function RSVPForm({ eventId, ownerId, eventName }: RSVPFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ownerId) {
      // Demo events (no Firestore backing) — accept gracefully without a write.
      setStatus("submitted");
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    try {
      await addDoc(collection(db, "rsvps"), {
        eventId,
        ownerId,
        name: String(data.get("name") || "").trim(),
        guests: String(data.get("guests") || "1"),
        message: String(data.get("message") || "").trim(),
        createdAt: serverTimestamp(),
      });
      setStatus("submitted");
      form.reset();
    } catch (err) {
      console.warn("[rsvp] write failed:", err);
      setStatus("error");
    }
  }

  if (status === "submitted") {
    return (
      <div
        className="rounded-3xl p-10 text-center"
        style={{
          background:
            "linear-gradient(145deg, rgba(200,155,60,0.08) 0%, rgba(147,168,138,0.06) 100%)",
          border: "1px solid rgba(200,155,60,0.20)",
          boxShadow: "0 8px 40px rgba(23,32,51,0.06)",
        }}
      >
        {/* Animated check */}
        <div
          className="mx-auto mb-5 flex items-center justify-center h-16 w-16 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(200,155,60,0.18) 0%, rgba(147,168,138,0.14) 100%)",
            border: "1px solid rgba(200,155,60,0.25)",
          }}
        >
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="#c89b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-semibold text-navy">You&rsquo;re on the list!</h3>

        <p className="mt-3 text-[0.95rem] text-mutedText max-w-sm mx-auto leading-relaxed">
          Thank you for confirming for{" "}
          <span className="font-semibold text-navy">{eventName}</span>. We can&rsquo;t wait to celebrate with you.
        </p>
        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-7">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: i === 1 ? "#c89b3c" : "rgba(200,155,60,0.3)" }}
            />
          ))}
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl px-4 py-3.5 text-[0.9rem] text-navy placeholder:text-mutedText/60 outline-none transition-all duration-200";
  const inputStyle = {
    background: "rgba(255,253,248,0.9)",
    border: "1px solid rgba(23,32,51,0.10)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  };
  const inputFocusStyle =
    "focus:border-gold focus:ring-2 focus:ring-gold/15";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl overflow-hidden"
      style={{
        background: "rgba(255,253,248,0.96)",
        border: "1px solid rgba(200,155,60,0.15)",
        boxShadow: "0 10px 48px rgba(23,32,51,0.08)",
      }}
    >
      {/* Form header */}
      <div
        className="px-8 py-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(200,155,60,0.09) 0%, rgba(200,155,60,0.03) 100%)",
          borderBottom: "1px solid rgba(200,155,60,0.12)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center h-10 w-10 rounded-xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #172033, #22304d)",
            }}
          >
            <svg className="h-4.5 w-4.5 text-gold-light" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-dark mb-0.5">
              RSVP
            </p>
            <h3 className="font-display text-[1.05rem] font-semibold text-navy leading-none">
              Confirm your attendance
            </h3>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="grid gap-4 p-8 sm:grid-cols-2">
        <div>
          <label htmlFor="rsvp-name" className="block text-[0.8rem] font-semibold text-navy mb-2">
            Full name
          </label>
          <input
            id="rsvp-name"
            name="name"
            required
            placeholder="Your name"
            className={`${inputClass} ${inputFocusStyle}`}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="rsvp-guests" className="block text-[0.8rem] font-semibold text-navy mb-2">
            Number of guests
          </label>
          <select
            id="rsvp-guests"
            name="guests"
            defaultValue="1"
            className={`${inputClass} ${inputFocusStyle}`}
            style={inputStyle}
          >
            {["1", "2", "3", "4", "5+"].map((n) => (
              <option key={n} value={n}>
                {n} {n === "1" ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="rsvp-message" className="block text-[0.8rem] font-semibold text-navy mb-2">
            Message or wishes{" "}
            <span className="font-normal text-mutedText">(optional)</span>
          </label>
          <textarea
            id="rsvp-message"
            name="message"
            rows={3}
            placeholder="Share a few warm words for the celebration…"
            className={`${inputClass} ${inputFocusStyle} resize-none`}
            style={inputStyle}
          />
        </div>

        {status === "error" && (
          <p
            className="sm:col-span-2 text-[0.83rem] rounded-xl px-4 py-3"
            style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c" }}
            role="alert"
          >
            Something went wrong while sending your RSVP. Please try again.
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-8 py-4 font-semibold text-[0.95rem] text-navy-dark transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60 disabled:hover:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #f0d080 0%, #c89b3c 50%, #a67f2e 100%)",
              boxShadow: "0 0 32px rgba(200,155,60,0.45), 0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            {/* shimmer */}
            <span
              className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-out"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              }}
              aria-hidden
            />
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            {status === "submitting" ? "Sending…" : "Confirm Attendance"}
          </button>
        </div>
      </div>
    </form>
  );
}
