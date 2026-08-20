"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/site";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";
import { CallbackModal } from "@/components/ui/CallbackModal";

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
              href="/login"
              className={cn(
                "px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                glassy
                  ? "text-ivory/75 hover:text-ivory"
                  : "text-ivory/85 hover:text-ivory"
              )}
            >
              Login
            </Link>

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
