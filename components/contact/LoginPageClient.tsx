"use client";

import Link from "next/link";
import { useState } from "react";

const GOLD = "#c89b3c";
const GOLD_LIGHT = "#e0c584";
const GOLD_PALE = "#f5dfa0";
const NAVY = "#172033";
const NAVY_DARK = "#0f1522";

function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden style={style}>
      <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
    </svg>
  );
}

export function LoginPageClient() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Login will be available at launch.");
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${NAVY_DARK} 0%, ${NAVY} 100%)` }}
    >
      {/* ── Background decoration ── */}
      {/* Gold bloom — top right */}
      <div
        className="absolute -top-48 -right-48 pointer-events-none"
        style={{
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,155,60,0.18) 0%, rgba(200,155,60,0.05) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      {/* Purple depth — bottom left */}
      <div
        className="absolute -bottom-40 -left-40 pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,122,203,0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        aria-hidden
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${GOLD_LIGHT} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
        }}
        aria-hidden
      />
      {/* Diagonal beam */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%", left: "30%",
          width: "1px", height: "60%",
          background: "linear-gradient(to bottom, transparent, rgba(200,155,60,0.15) 40%, rgba(200,155,60,0.06) 70%, transparent)",
          transform: "rotate(-15deg)",
          filter: "blur(1px)",
        }}
        aria-hidden
      />

      {/* ── Back to home link ── */}
      <Link
        href="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-[0.8rem] font-medium transition-all duration-200 hover:-translate-x-0.5"
        style={{ color: "rgba(255,253,248,0.45)" }}
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M13 8H3M7 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to home
      </Link>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto px-4 py-10">
        {/* Logo / Brand mark */}
        <div className="flex flex-col items-center mb-10">
          {/* Decorative ring */}
          <div
            className="flex items-center justify-center h-14 w-14 rounded-2xl mb-5"
            style={{
              background: "linear-gradient(145deg, rgba(200,155,60,0.20), rgba(200,155,60,0.07))",
              border: "1px solid rgba(200,155,60,0.35)",
              boxShadow: "0 0 32px rgba(200,155,60,0.18)",
            }}
          >
            <Sparkle
              className="h-6 w-6"
              style={{ color: GOLD_LIGHT } as React.CSSProperties}
            />
          </div>

          {/* Brand name */}
          <span
            className="font-display font-bold text-[1.35rem] tracking-tight"
            style={{
              background: `linear-gradient(110deg, ${GOLD_PALE} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Palei Events
          </span>

          {/* Eyebrow */}
          <div
            className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: "rgba(200,155,60,0.10)",
              border: "1px solid rgba(200,155,60,0.25)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-40" style={{ background: GOLD }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: GOLD_LIGHT }} />
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD_LIGHT }}>
              Secure Login
            </span>
          </div>
        </div>

        {/* Glass card */}
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(145deg, rgba(255,253,248,0.07) 0%, rgba(255,253,248,0.03) 100%)",
            border: "1px solid rgba(200,155,60,0.20)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(200,155,60,0.12) inset",
          }}
        >
          {/* Top shimmer line */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)`,
            }}
            aria-hidden
          />

          <div className="p-8 md:p-10">
            {/* Heading */}
            <h1
              className="font-display font-semibold leading-tight mb-1"
              style={{ fontSize: "1.75rem", color: "#fffdf8" }}
            >
              Welcome back
            </h1>
            <p className="text-[0.87rem] mb-8" style={{ color: "rgba(255,253,248,0.48)" }}>
              Log in to manage your events, galleries and guests.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-[0.76rem] font-semibold uppercase tracking-[0.16em] mb-2"
                  style={{ color: focused === "email" ? GOLD_LIGHT : "rgba(255,253,248,0.45)" }}
                >
                  Email address
                </label>
                <div className="relative">
                  <div
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: focused === "email" ? GOLD : "rgba(255,253,248,0.25)" }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-[0.93rem] outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,253,248,0.06)",
                      border: focused === "email"
                        ? `1px solid ${GOLD}80`
                        : "1px solid rgba(255,253,248,0.12)",
                      color: "#fffdf8",
                      boxShadow: focused === "email"
                        ? `0 0 0 3px rgba(200,155,60,0.12)`
                        : "none",
                      caretColor: GOLD,
                    }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="login-password"
                    className="block text-[0.76rem] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: focused === "password" ? GOLD_LIGHT : "rgba(255,253,248,0.45)" }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[0.74rem] font-medium transition-colors duration-200"
                    style={{ color: GOLD_LIGHT }}
                    onClick={() => alert("Password reset will be available at launch.")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: focused === "password" ? GOLD : "rgba(255,253,248,0.25)" }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="login-password"
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl pl-11 pr-12 py-3.5 text-[0.93rem] outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,253,248,0.06)",
                      border: focused === "password"
                        ? `1px solid ${GOLD}80`
                        : "1px solid rgba(255,253,248,0.12)",
                      color: "#fffdf8",
                      boxShadow: focused === "password"
                        ? `0 0 0 3px rgba(200,155,60,0.12)`
                        : "none",
                      caretColor: GOLD,
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: "rgba(255,253,248,0.35)" }}
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <div
                  className="relative h-5 w-5 rounded-md flex-shrink-0 cursor-pointer"
                  style={{
                    background: "rgba(255,253,248,0.07)",
                    border: "1px solid rgba(255,253,248,0.18)",
                  }}
                >
                  <input type="checkbox" className="sr-only" id="remember" />
                </div>
                <label
                  htmlFor="remember"
                  className="text-[0.82rem] cursor-pointer"
                  style={{ color: "rgba(255,253,248,0.50)" }}
                >
                  Keep me logged in
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-2xl py-4 font-semibold text-[1rem] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD_LIGHT} 25%, ${GOLD} 60%, #a67f2e 100%)`,
                  boxShadow: `0 0 40px rgba(200,155,60,0.50), 0 4px 16px rgba(0,0,0,0.25)`,
                  color: NAVY_DARK,
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
                  aria-hidden
                />
                Sign in to your account
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-3 my-7">
              <div className="flex-1 h-px" style={{ background: "rgba(255,253,248,0.10)" }} />
              <span className="text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "rgba(255,253,248,0.28)" }}>
                or continue with
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,253,248,0.10)" }} />
            </div>

            {/* Social login placeholders */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Google",
                  icon: (
                    <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  icon: (
                    <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => alert(`${s.label} login coming at launch.`)}
                  className="flex items-center justify-center gap-2.5 rounded-2xl py-3 text-[0.85rem] font-medium transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255,253,248,0.05)",
                    border: "1px solid rgba(255,253,248,0.12)",
                    color: "rgba(255,253,248,0.70)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>

            {/* Sign up link */}
            <p className="mt-8 text-center text-[0.84rem]" style={{ color: "rgba(255,253,248,0.40)" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/create-event"
                className="font-semibold transition-colors duration-200"
                style={{ color: GOLD_LIGHT }}
              >
                Get started free →
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom info notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center">
          <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 16 16" fill={GOLD} aria-hidden>
            <path fillRule="evenodd" d="M8 1a4 4 0 014 4v1h1a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1h1V5a4 4 0 014-4zm0 1.5A2.5 2.5 0 005.5 5v1h5V5A2.5 2.5 0 008 2.5z" clipRule="evenodd" />
          </svg>
          <p className="text-[0.72rem]" style={{ color: "rgba(255,253,248,0.28)" }}>
            Authentication launches soon. Explore demo events in the meantime.
          </p>
        </div>
      </div>
    </div>
  );
}
