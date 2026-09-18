"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/site";
import { usePublicCustomer } from "./usePublicCustomer";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onCallbackOpen: () => void;
  pathname: string;
}

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function initials(nameOrEmail: string | null): string {
  if (!nameOrEmail) return "?";
  const parts = nameOrEmail.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "")).toUpperCase() || "?";
}

/** Signed-in account block for the mobile menu (hidden when logged out). */
function MobileAccount({ onClose }: { onClose: () => void }) {
  const { user, signOutPublic } = usePublicCustomer();
  const router = useRouter();
  if (!user) return null;

  async function handleSignOut() {
    onClose();
    await signOutPublic();
    router.replace("/");
  }

  return (
    <div
      className="mb-5 rounded-2xl p-4"
      style={{
        background: "linear-gradient(135deg, rgba(200,155,60,0.10), rgba(200,155,60,0.03))",
        border: "1px solid rgba(200,155,60,0.22)",
      }}
    >
      <div className="flex items-center gap-3">
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="h-9 w-9 rounded-xl object-cover" />
        ) : (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[0.7rem] font-bold"
            style={{ background: "linear-gradient(135deg, #c89b3c, #a67f2e)", color: "#0f1522" }}
          >
            {initials(user.displayName || user.email)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.85rem] font-semibold text-ivory">
            {user.displayName || user.email?.split("@")[0] || "Customer"}
          </p>
          <p className="truncate text-[0.68rem] text-ivory/45">{user.email}</p>
        </div>
        <span
          className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-[0.56rem] font-bold uppercase tracking-[0.14em]"
          style={{
            background: user.plan === "free" ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)",
            color: user.plan === "free" ? "#fbbf24" : "#34d399",
          }}
        >
          {user.plan === "free" ? "No plan" : user.plan}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="rounded-xl px-3 py-2.5 text-center text-[0.78rem] font-semibold"
          style={{ background: "rgba(200,155,60,0.14)", color: "#e0c584" }}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/plan"
          onClick={onClose}
          className="rounded-xl px-3 py-2.5 text-center text-[0.78rem] font-semibold"
          style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,253,248,0.7)" }}
        >
          Plan
        </Link>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="mt-2 w-full rounded-xl px-3 py-2.5 text-[0.78rem] font-semibold"
        style={{ background: "rgba(239,68,68,0.10)", color: "#fca5a5" }}
      >
        Sign out
      </button>
    </div>
  );
}

export function MobileMenu({ open, onClose, onCallbackOpen, pathname }: MobileMenuProps) {
  return (
    <div
      id="mobile-menu"
      className={cn(
        "lg:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        open ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}
    >
      <div
        className="border-t px-5 pt-4 pb-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,15,28,0.98) 0%, rgba(15,21,34,0.98) 100%)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          borderColor: "rgba(200,155,60,0.12)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.45)",
        }}
      >
        {/* Signed-in customer block (hidden when logged out) */}
        <MobileAccount onClose={onClose} />

        {/* Nav links */}
        <nav aria-label="Mobile navigation" className="flex flex-col gap-0.5 mb-5">
          {navLinks.map((link, i) => {
            const active = isActive(link.href, pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center justify-between rounded-2xl px-4 py-3.5 text-[0.95rem] font-medium transition-all duration-200",
                  active
                    ? "text-gold-light"
                    : "text-ivory/70 hover:text-ivory"
                )}
                style={{
                  background: active
                    ? "linear-gradient(135deg, rgba(200,155,60,0.12), rgba(200,155,60,0.05))"
                    : undefined,
                  border: active
                    ? "1px solid rgba(200,155,60,0.20)"
                    : "1px solid transparent",
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <span className="flex items-center gap-3">
                  {/* active dot */}
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0 transition-all duration-200"
                    style={{
                      background: active ? "#e0c584" : "rgba(255,253,248,0.18)",
                      boxShadow: active ? "0 0 6px rgba(200,155,60,0.6)" : "none",
                    }}
                  />
                  {link.label}
                </span>

                {/* arrow */}
                <svg
                  className={cn(
                    "h-3.5 w-3.5 transition-all duration-200",
                    active ? "opacity-60" : "opacity-25 group-hover:opacity-60 group-hover:translate-x-0.5"
                  )}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke={active ? "#e0c584" : "currentColor"}
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div
          className="mb-5"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(200,155,60,0.18), transparent)",
          }}
          aria-hidden
        />

        {/* CTA buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Request Callback */}
          <button
            type="button"
            onClick={onCallbackOpen}
            className="group relative overflow-hidden flex items-center justify-center gap-2.5 rounded-2xl px-5 py-3.5 text-[0.9rem] font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background:
                "linear-gradient(135deg, #f5dfa0 0%, #e0c584 30%, #c89b3c 70%, #a67f2e 100%)",
              boxShadow: "0 0 28px rgba(200,155,60,0.38), 0 4px 12px rgba(0,0,0,0.2)",
              color: "#0f1522",
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              }}
              aria-hidden
            />
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
            Request a Callback
          </button>

          {/* Create Event */}
          <Link
            href="/create-event"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[0.9rem] font-semibold transition-all duration-200"
            style={{
              border: "1px solid rgba(200,155,60,0.28)",
              background: "rgba(200,155,60,0.07)",
              color: "#e0c584",
            }}
          >
            Create Event
          </Link>

          {/* Login (hidden while a customer session is active) */}
          <MobileLoginLink />
        </div>

        {/* Bottom micro-text */}
        <p
          className="mt-5 text-center text-[0.68rem] uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,253,248,0.20)" }}
        >
          Mon – Sat · 9 AM – 7 PM IST
        </p>
      </div>
    </div>
  );
}

function MobileLoginLink() {
  const { user, loading } = usePublicCustomer();
  if (loading || user) return null;
  return (
    <Link
      href="/login"
      className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[0.88rem] font-medium transition-all duration-200"
      style={{
        border: "1px solid rgba(255,255,255,0.09)",
        background: "transparent",
        color: "rgba(255,253,248,0.55)",
      }}
    >
      Login to your account
    </Link>
  );
}
