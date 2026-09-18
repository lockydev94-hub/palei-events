"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext";

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

function friendlyAuthError(err: unknown): string {
  const code = err instanceof FirebaseError ? err.code : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists — try logging in.";
    case "auth/weak-password":
      return "Password is too weak (use at least 6 characters).";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/network-request-failed":
      return "Network error — check your connection and retry.";
    default:
      return err instanceof Error && err.message
        ? err.message
        : "Something went wrong. Please try again.";
  }
}

type Mode = "login" | "register" | "forgot";

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, loginWithGoogle, resetPassword } = useCustomerAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function afterAuth(isAdmin: boolean) {
    // Admins land in the admin console; everyone else on the customer
    // dashboard (which itself gates un-approved plans).
    const next = searchParams.get("next");
    if (next && next.startsWith("/")) {
      router.replace(next);
    } else if (isAdmin) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/dashboard");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "login") {
        const u = await login(email, password);
        await afterAuth(u.isAdmin);
      } else if (mode === "register") {
        const u = await register(name, email, password);
        await afterAuth(u.isAdmin);
      } else {
        await resetPassword(email);
        setNotice("Password reset email sent — check your inbox.");
      }
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const u = await loginWithGoogle();
      await afterAuth(u.isAdmin);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl pl-11 pr-4 py-3.5 text-[0.93rem] outline-none transition-all duration-200";
  const inputStyle = (field: string) => ({
    background: "rgba(255,253,248,0.06)",
    border: focused === field ? `1px solid ${GOLD}80` : "1px solid rgba(255,253,248,0.12)",
    color: "#fffdf8",
    boxShadow: focused === field ? "0 0 0 3px rgba(200,155,60,0.12)" : "none",
    caretColor: GOLD,
  });

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${NAVY_DARK} 0%, ${NAVY} 100%)` }}
    >
      {/* ── Background decoration ── */}
      <div
        className="absolute -top-48 -right-48 pointer-events-none"
        style={{
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,155,60,0.18) 0%, rgba(200,155,60,0.05) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-40 pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,122,203,0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${GOLD_LIGHT} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
        }}
        aria-hidden
      />

      {/* ── Back to home link ── */}
      <Link
        href="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-[0.8rem] font-medium transition-all duration-200 hover:-translate-x-0.5 z-20"
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
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center h-14 w-14 rounded-2xl mb-5"
            style={{
              background: "linear-gradient(145deg, rgba(200,155,60,0.20), rgba(200,155,60,0.07))",
              border: "1px solid rgba(200,155,60,0.35)",
              boxShadow: "0 0 32px rgba(200,155,60,0.18)",
            }}
          >
            <Sparkle className="h-6 w-6" style={{ color: GOLD_LIGHT } as React.CSSProperties} />
          </div>

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
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)` }}
            aria-hidden
          />

          <div className="p-8 md:p-10">
            {/* Heading */}
            <h1
              className="font-display font-semibold leading-tight mb-1"
              style={{ fontSize: "1.75rem", color: "#fffdf8" }}
            >
              {mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset password"}
            </h1>
            <p className="text-[0.87rem] mb-7" style={{ color: "rgba(255,253,248,0.48)" }}>
              {mode === "login"
                ? "Log in to manage your events, galleries and guests."
                : mode === "register"
                ? "Start free — pick a plan when you're ready to publish."
                : "We'll email you a secure reset link."}
            </p>

            {/* Error / notice */}
            {error && (
              <div
                className="mb-5 rounded-xl px-4 py-3 text-[0.83rem]"
                style={{
                  background: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  color: "#fca5a5",
                }}
                role="alert"
              >
                {error}
              </div>
            )}
            {notice && (
              <div
                className="mb-5 rounded-xl px-4 py-3 text-[0.83rem]"
                style={{
                  background: "rgba(16,185,129,0.10)",
                  border: "1px solid rgba(16,185,129,0.35)",
                  color: "#6ee7b7",
                }}
                role="status"
              >
                {notice}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name (register only) */}
              {mode === "register" && (
                <div>
                  <label
                    htmlFor="login-name"
                    className="block text-[0.76rem] font-semibold uppercase tracking-[0.16em] mb-2"
                    style={{ color: focused === "name" ? GOLD_LIGHT : "rgba(255,253,248,0.45)" }}
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: focused === "name" ? GOLD : "rgba(255,253,248,0.25)" }}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="login-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      placeholder="Your name"
                      className={inputClass}
                      style={inputStyle("name")}
                    />
                  </div>
                </div>
              )}

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
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    className={inputClass}
                    style={inputStyle("email")}
                  />
                </div>
              </div>

              {/* Password field (not on forgot) */}
              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="login-password"
                      className="block text-[0.76rem] font-semibold uppercase tracking-[0.16em]"
                      style={{ color: focused === "password" ? GOLD_LIGHT : "rgba(255,253,248,0.45)" }}
                    >
                      {mode === "register" ? "Choose a password" : "Password"}
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        className="text-[0.74rem] font-medium transition-colors duration-200"
                        style={{ color: GOLD_LIGHT }}
                        onClick={() => {
                          setMode("forgot");
                          setError(null);
                          setNotice(null);
                        }}
                      >
                        Forgot password?
                      </button>
                    )}
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
                      minLength={6}
                      autoComplete={mode === "register" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      placeholder="••••••••"
                      className={inputClass + " pr-12"}
                      style={inputStyle("password")}
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
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="group relative w-full overflow-hidden rounded-2xl py-4 font-semibold text-[1rem] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD_LIGHT} 25%, ${GOLD} 60%, #a67f2e 100%)`,
                  boxShadow: "0 0 40px rgba(200,155,60,0.50), 0 4px 16px rgba(0,0,0,0.25)",
                  color: NAVY_DARK,
                }}
              >
                {busy ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Please wait…
                  </span>
                ) : mode === "login" ? (
                  "Sign in to your account"
                ) : mode === "register" ? (
                  "Create my account"
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            {/* Divider + Google (not on forgot) */}
            {mode !== "forgot" && (
              <>
                <div className="relative flex items-center gap-3 my-7">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,253,248,0.10)" }} />
                  <span className="text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "rgba(255,253,248,0.28)" }}>
                    or continue with
                  </span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,253,248,0.10)" }} />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-[0.88rem] font-medium transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                  style={{
                    background: "rgba(255,253,248,0.05)",
                    border: "1px solid rgba(255,253,248,0.12)",
                    color: "rgba(255,253,248,0.70)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            {/* Mode switch */}
            <p className="mt-8 text-center text-[0.84rem]" style={{ color: "rgba(255,253,248,0.40)" }}>
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold transition-colors duration-200"
                    style={{ color: GOLD_LIGHT }}
                    onClick={() => { setMode("register"); setError(null); setNotice(null); }}
                  >
                    Create one free →
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold transition-colors duration-200"
                    style={{ color: GOLD_LIGHT }}
                    onClick={() => { setMode("login"); setError(null); setNotice(null); }}
                  >
                    Sign in →
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
