"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CallbackModalProps {
  open: boolean;
  onClose: () => void;
}

/* ── Sparkle ─────────────────────────────────────────────────── */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
    </svg>
  );
}

/* ── Animated confetti dots ──────────────────────────────────── */
function ConfettiDots() {
  const dots = [
    { color: "#e0c584", x: "18%", y: "15%", size: 6, delay: 0 },
    { color: "#9b7acb", x: "82%", y: "12%", size: 5, delay: 120 },
    { color: "#c89b3c", x: "12%", y: "72%", size: 4, delay: 240 },
    { color: "#93a88a", x: "88%", y: "68%", size: 5, delay: 80 },
    { color: "#f5dfa0", x: "50%", y: "8%",  size: 4, delay: 160 },
    { color: "#e88c9b", x: "76%", y: "82%", size: 4, delay: 200 },
    { color: "#c89b3c", x: "25%", y: "88%", size: 3, delay: 320 },
    { color: "#e0c584", x: "65%", y: "20%", size: 3, delay: 60  },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: d.size,
            height: d.size,
            left: d.x,
            top: d.y,
            background: d.color,
            animation: `confettiPop 0.6s cubic-bezier(0.22,1,0.36,1) ${d.delay}ms both`,
            boxShadow: `0 0 6px ${d.color}80`,
          }}
          aria-hidden
        />
      ))}
    </>
  );
}

/* ── Animated check ring ─────────────────────────────────────── */
function CheckRing() {
  return (
    <div className="relative flex items-center justify-center h-28 w-28 mx-auto mb-6">
      {/* outer pulse ring */}
      <span
        className="absolute inset-0 rounded-full"
        style={{ animation: "successPulse 1.8s ease-out 0.2s infinite" }}
        aria-hidden
      />
      {/* mid ring */}
      <span
        className="absolute inset-2 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(200,155,60,0.14), rgba(200,155,60,0.06))",
          border: "1px solid rgba(200,155,60,0.22)",
          animation: "successPulse 1.8s ease-out 0.4s infinite",
        }}
        aria-hidden
      />
      {/* main circle */}
      <div
        className="relative flex items-center justify-center h-20 w-20 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(200,155,60,0.20), rgba(200,155,60,0.08))",
          border: "1.5px solid rgba(200,155,60,0.35)",
          boxShadow:
            "0 0 48px rgba(200,155,60,0.25), 0 8px 32px rgba(200,155,60,0.15)",
          animation: "checkRingIn 0.5s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* check svg with stroke animation */}
        <svg
          className="h-10 w-10"
          viewBox="0 0 40 40"
          fill="none"
          stroke="#e0c584"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path
            d="M8 21 L17 30 L32 12"
            style={{ animation: "drawCheck 0.5s cubic-bezier(0.22,1,0.36,1) 0.35s both" }}
            strokeDasharray="40"
            strokeDashoffset="40"
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Success screen ──────────────────────────────────────────── */
function SuccessScreen({ phone, onClose }: { phone: string; onClose: () => void }) {
  return (
    <div className="relative overflow-hidden text-center px-8 pb-8 pt-4">
      <ConfettiDots />

      <CheckRing />

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5"
        style={{
          background: "linear-gradient(135deg, rgba(200,155,60,0.15), rgba(200,155,60,0.06))",
          border: "1px solid rgba(200,155,60,0.28)",
        }}
      >
        <Sparkle className="h-2.5 w-2.5 text-gold-light" />
        <span
          className="text-[0.67rem] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "#e0c584" }}
        >
          Request Received
        </span>
      </div>

      <h2
        className="font-display text-[1.7rem] font-semibold leading-tight mb-3"
        style={{ color: "#172033" }}
      >
        We&rsquo;ll call you back!
      </h2>
      <p
        className="text-[0.93rem] leading-relaxed max-w-xs mx-auto mb-1"
        style={{ color: "rgba(23,32,51,0.58)" }}
      >
        Our team will reach out to{" "}
        <span className="font-semibold" style={{ color: "#172033" }}>
          {phone}
        </span>{" "}
        within the next 30 minutes.
      </p>
      <p
        className="text-[0.8rem]"
        style={{ color: "rgba(23,32,51,0.38)" }}
      >
        Mon – Sat · 9 AM – 7 PM IST
      </p>

      {/* Progress bar */}
      <div
        className="mt-6 mx-auto rounded-full overflow-hidden"
        style={{
          height: "3px",
          width: "80px",
          background: "rgba(200,155,60,0.15)",
        }}
        aria-hidden
      >
        <div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #e0c584, #c89b3c)",
            animation: "progressFill 3s linear forwards",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-7 w-full rounded-2xl py-3.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background:
            "linear-gradient(135deg, #f5dfa0 0%, #c89b3c 60%, #a67f2e 100%)",
          boxShadow: "0 0 24px rgba(200,155,60,0.35)",
          color: "#0f1522",
        }}
      >
        Done
      </button>
    </div>
  );
}

/* ── Main modal ──────────────────────────────────────────────── */
export function CallbackModal({ open, onClose }: CallbackModalProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open && !success) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open, success]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setPhone("");
        setLoading(false);
        setSuccess(false);
        setError("");
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Trap body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const validate = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length < 10) return "Please enter a valid 10-digit mobile number.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(phone);
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    // Simulate API call — replace with real endpoint when ready
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    if (error) setError("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[998] transition-all duration-400",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        style={{
          background: "rgba(10,15,28,0.72)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
        onClick={onClose}
        aria-hidden
      />

      {/* Modal panel */}
      <div
        className={cn(
          "fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Request a callback"
      >
        <div
          ref={panelRef}
          className={cn(
            "w-full max-w-sm rounded-3xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-y-6 scale-95 pointer-events-none"
          )}
          style={{
            background: "rgba(255,253,248,0.99)",
            boxShadow:
              "0 32px 96px rgba(10,15,28,0.5), 0 0 0 1px rgba(200,155,60,0.15), 0 0 80px rgba(200,155,60,0.08)",
          }}
        >
          {success ? (
            <SuccessScreen phone={phone} onClose={onClose} />
          ) : (
            <>
              {/* Header */}
              <div
                className="relative px-7 pt-7 pb-6 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #0f1522 0%, #172033 100%)",
                }}
              >
                {/* ambient glow */}
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(200,155,60,0.22) 0%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                  aria-hidden
                />
                <div
                  className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(155,122,203,0.15) 0%, transparent 70%)",
                    filter: "blur(16px)",
                  }}
                  aria-hidden
                />

                {/* close button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150 hover:bg-white/10"
                  style={{ color: "rgba(255,253,248,0.5)" }}
                  aria-label="Close"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>

                {/* icon + eyebrow */}
                <div className="relative z-10 flex items-start gap-4">
                  <div
                    className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #e0c584, #c89b3c)",
                      boxShadow: "0 0 24px rgba(200,155,60,0.45)",
                    }}
                  >
                    <svg
                      className="h-5.5 w-5.5"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="#0f1522"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div className="pt-0.5">
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-2"
                      style={{
                        background: "rgba(200,155,60,0.12)",
                        border: "1px solid rgba(200,155,60,0.25)",
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full animate-pulse"
                        style={{ background: "#e0c584" }}
                        aria-hidden
                      />
                      <span
                        className="text-[0.62rem] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: "#e0c584" }}
                      >
                        We call you
                      </span>
                    </div>
                    <h2
                      className="font-display text-[1.25rem] font-semibold leading-tight text-ivory"
                    >
                      Request a Callback
                    </h2>
                    <p
                      className="text-[0.8rem] mt-1 leading-relaxed"
                      style={{ color: "rgba(255,253,248,0.50)" }}
                    >
                      Enter your number — we&rsquo;ll call within 30 min.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} className="px-7 pt-6 pb-7">
                <label
                  htmlFor="callback-phone"
                  className="block text-[0.78rem] font-semibold mb-2"
                  style={{ color: "#172033" }}
                >
                  Mobile number
                </label>

                {/* Phone input with +91 prefix */}
                <div
                  className={cn(
                    "flex items-center rounded-2xl overflow-hidden transition-all duration-200",
                    error
                      ? "ring-2 ring-red-400/60"
                      : "focus-within:ring-2 focus-within:ring-gold/30"
                  )}
                  style={{
                    background: "rgba(255,253,248,0.85)",
                    border: `1px solid ${error ? "rgba(239,68,68,0.4)" : "rgba(23,32,51,0.12)"}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* country code */}
                  <div
                    className="flex items-center gap-1.5 pl-4 pr-3 py-3.5 flex-shrink-0"
                    style={{
                      borderRight: "1px solid rgba(23,32,51,0.10)",
                      color: "rgba(23,32,51,0.50)",
                    }}
                  >
                    <span className="text-sm">🇮🇳</span>
                    <span className="text-[0.85rem] font-semibold" style={{ color: "#172033" }}>
                      +91
                    </span>
                  </div>
                  <input
                    ref={inputRef}
                    id="callback-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="94377 39550"
                    className="flex-1 px-3.5 py-3.5 text-[0.95rem] font-medium outline-none bg-transparent placeholder:text-mutedText/40"
                    style={{ color: "#172033" }}
                    required
                  />
                </div>

                {/* error */}
                {error && (
                  <p
                    className="mt-2 text-[0.78rem] flex items-center gap-1.5"
                    style={{ color: "rgba(239,68,68,0.85)" }}
                  >
                    <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5a1 1 0 112 0v3a1 1 0 11-2 0V5zm1 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                )}

                {/* best time hint */}
                <p
                  className="mt-3 text-[0.75rem] flex items-center gap-1.5"
                  style={{ color: "rgba(23,32,51,0.40)" }}
                >
                  <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a5 5 0 110 10A5 5 0 018 3zm.5 2.5A.5.5 0 008 5v4l2.5 1.5a.5.5 0 00.5-.866L9 8.134V5.5A.5.5 0 008.5 5z" clipRule="evenodd" />
                  </svg>
                  Available Mon – Sat, 9 AM – 7 PM IST
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 group relative overflow-hidden w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-[0.95rem] font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
                  style={{
                    background: loading
                      ? "linear-gradient(135deg, #c89b3c, #a67f2e)"
                      : "linear-gradient(135deg, #f5dfa0 0%, #e0c584 30%, #c89b3c 70%, #a67f2e 100%)",
                    boxShadow: "0 0 32px rgba(200,155,60,0.40), 0 4px 14px rgba(0,0,0,0.16)",
                    color: "#0f1522",
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
                  {loading ? (
                    <>
                      {/* spinner */}
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Requesting…
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      Request Callback
                    </>
                  )}
                </button>

                {/* privacy micro note */}
                <p
                  className="mt-3.5 text-center text-[0.72rem]"
                  style={{ color: "rgba(23,32,51,0.32)" }}
                >
                  Your number is never shared with third parties.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Modal-specific keyframes */}
      <style>{`
        @keyframes confettiPop {
          from { opacity: 0; transform: scale(0) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes checkRingIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes successPulse {
          0%   { box-shadow: 0 0 0 0 rgba(200,155,60,0.35); opacity:1; }
          70%  { box-shadow: 0 0 0 18px rgba(200,155,60,0); opacity:0; }
          100% { box-shadow: 0 0 0 0 rgba(200,155,60,0); opacity:0; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </>
  );
}
