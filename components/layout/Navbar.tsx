"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/site";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";
import { CallbackModal } from "@/components/ui/CallbackModal";
import { usePublicCustomer } from "./usePublicCustomer";

/* ── helpers ──────────────────────────────────────────── */
function initials(nameOrEmail: string | null): string {
  if (!nameOrEmail) return "?";
  const parts = nameOrEmail.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "")).toUpperCase() || "?";
}

/** Desktop account dropdown for the signed-in customer. */
function AccountMenu() {
  const { user, signOutPublic } = usePublicCustomer();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  if (!user) return null;

  async function handleSignOut() {
    setOpen(false);
    await signOutPublic();
    router.replace("/");
  }

  const items = [
    { href: "/dashboard", label: "Dashboard", hint: "Overview & activity" },
    { href: "/dashboard/events", label: "My Events", hint: "Create & manage event pages" },
    { href: "/dashboard/plan", label: "Plan & Billing", hint: user.plan === "free" ? "Choose your plan" : "Manage your subscription" },
    { href: "/dashboard/profile", label: "Profile", hint: "Account settings" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-200"
        style={{
          border: open ? "1px solid rgba(200,155,60,0.45)" : "1px solid rgba(255,255,255,0.14)",
          background: open ? "rgba(200,155,60,0.10)" : "rgba(255,255,255,0.04)",
        }}
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="h-7 w-7 rounded-lg object-cover" />
        ) : (
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[0.62rem] font-bold"
            style={{ background: "linear-gradient(135deg, #c89b3c, #a67f2e)", color: "#0f1522" }}
          >
            {initials(user.displayName || user.email)}
          </span>
        )}
        <span className="hidden max-w-[120px] truncate text-[0.8rem] font-medium text-ivory/85 xl:block">
          {user.displayName || user.email?.split("@")[0]}
        <span className="block text-[0.55rem] uppercase tracking-[0.14em]" style={{ color: "#e0c584" }}>
            {user.plan === "free" ? "No plan" : `${user.plan} plan`}
          </span>
        </span>
        <svg
          className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")}
          viewBox="0 0 12 12"
          fill="none"
          stroke="rgba(255,253,248,0.5)"
          strokeWidth="1.6"
          aria-hidden
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(180deg, #10192a 0%, #172033 100%)",
            border: "1px solid rgba(200,155,60,0.25)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(200,155,60,0.12) inset",
          }}
        >
          {/* identity block */}
          <div className="border-b border-white/[0.07] px-4 py-3.5">
            <p className="truncate text-[0.84rem] font-semibold text-ivory">
              {user.displayName || user.email?.split("@")[0] || "Customer"}
            </p>
            <p className="mt-0.5 truncate text-[0.7rem] text-ivory/45">{user.email}</p>
            <span
              className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.14em]"
              style={{
                background: user.plan === "free" ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)",
                color: user.plan === "free" ? "#fbbf24" : "#34d399",
              }}
            >
              {user.plan === "free" ? "No plan yet" : `${user.plan} plan`}
            </span>
          </div>
          {/* links */}
          <div className="p-1.5">
            {items.map(({ href, label, hint }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                role="menuitem"
                className="block rounded-xl px-3.5 py-2.5 transition-colors duration-150 hover:bg-white/[0.06]"
              >
                <span className="block text-[0.82rem] font-medium text-ivory/85">{label}</span>
                <span className="mt-0.5 block text-[0.66rem] text-ivory/40">{hint}</span>
              </Link>
            ))}
          </div>
          {/* sign out */}
          <div className="border-t border-white/[0.07] p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-colors duration-150 hover:bg-red-500/10"
              style={{ color: "#fca5a5" }}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              <span className="text-[0.82rem] font-medium">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { Logo };

/* ── active-link helper ──────────────────────────────────────── */
function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  // exact match or sub-path match
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close mobile menu on route change (render-phase state adjustment)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  const glassy = scrolled || menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out",
          glassy
            ? "bg-navy-dark/92 backdrop-blur-2xl shadow-[0_2px_32px_rgba(10,15,28,0.55)] border-b border-white/[0.06]"
            : "bg-transparent"
        )}
      >
        <nav
          className="container-shell flex h-16 items-center justify-between md:h-[72px]"
          aria-label="Primary"
        >
          {/* Logo */}
          <Logo dark={false} />

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    active
                      ? "text-gold-light"
                      : glassy
                      ? "text-ivory/75 hover:text-ivory hover:bg-white/[0.06]"
                      : "text-ivory/85 hover:text-ivory hover:bg-white/[0.07]"
                  )}
                >
                  {link.label}
                  {/* active underline */}
                  {active && (
                    <span
                      className="absolute bottom-0.5 left-3.5 right-3.5 h-[1.5px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #e0c584, rgba(200,155,60,0.3))",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2.5 lg:flex">
            {/* Customer account menu (Login link hides while signed in) */}
            <AccountMenu />

            <Link
              href="/login"
              className={cn(
                "px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                glassy
                  ? "text-ivory/75 hover:text-ivory"
                  : "text-ivory/85 hover:text-ivory"
              )}
            >
              <PublicLoginLabel />
            </Link>
            {/* Request Callback */}
            <button
              type="button"
              onClick={() => setCallbackOpen(true)}
              className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                border: "1px solid rgba(200,155,60,0.32)",
                background: "rgba(200,155,60,0.07)",
                color: "#e0c584",
                backdropFilter: "blur(8px)",
              }}
            >
              <svg
                className="h-3.5 w-3.5 flex-shrink-0"
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
              Call Back
            </button>

            <Link
              href="/create-event"
              className="group relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-navy-dark transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              style={{
                background:
                  "linear-gradient(135deg, #f5dfa0 0%, #e0c584 30%, #c89b3c 70%, #a67f2e 100%)",
                boxShadow:
                  "0 0 20px rgba(200,155,60,0.35), 0 2px 10px rgba(0,0,0,0.2)",
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
              Create Event
            </Link>
          </div>

          {/* Mobile right side: callback + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* mobile callback button */}
            <button
              type="button"
              onClick={() => setCallbackOpen(true)}
              aria-label="Request a callback"
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={{
                background: "rgba(10,15,28,0.55)",
                border: "1px solid rgba(200,155,60,0.4)",
                color: "#e0c584",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <svg
                className="h-4 w-4"
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
            </button>

            {/* hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={{
                background: menuOpen
                  ? "rgba(10,15,28,0.75)"
                  : "rgba(10,15,28,0.55)",
                border: menuOpen
                  ? "1px solid rgba(200,155,60,0.55)"
                  : "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-ivory transition-all duration-300",
                    menuOpen && "top-[7px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[7px] h-[1.5px] w-5 rounded-full bg-ivory transition-all duration-300",
                    menuOpen && "opacity-0 scale-x-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[14px] h-[1.5px] w-5 rounded-full bg-ivory transition-all duration-300",
                    menuOpen && "top-[7px] -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>

        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onCallbackOpen={() => { setMenuOpen(false); setCallbackOpen(true); }}
          pathname={pathname}
        />
      </header>

      {/* Callback Modal */}
      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </>
  );
}

/** Login label that hides while the customer session is active. */
function PublicLoginLabel() {
  const { user, loading } = usePublicCustomer();
  if (loading || user) return <span className="invisible">Login</span>;
  return <span>Login</span>;
}
