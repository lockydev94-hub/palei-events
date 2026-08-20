"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pulse, setPulse] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrolled > 420);
      setProgress(max > 0 ? Math.min(scrolled / max, 1) : 0);
      if (scrolled > 420) setPulse(true);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedRef.current ? "auto" : "smooth" });
  };

  const R = 20;
  const C = 2 * Math.PI * R;

  return (
    <div
      className="fixed bottom-20 left-5 z-[190] md:bottom-6 md:left-6"
      aria-hidden={!visible}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        style={{
          background: "linear-gradient(145deg, rgba(23,32,51,0.96) 0%, rgba(15,21,34,0.98) 100%)",
          border: "1px solid rgba(200,155,60,0.35)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Pulse ring on first appear */}
        {pulse && visible && (
          <span
            className="absolute inset-0 rounded-full"
            style={{ animation: "scrollTopPulse 2.2s ease-out 0.5s 1" }}
            aria-hidden
          />
        )}

        {/* Progress ring */}
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 48 48"
          aria-hidden
        >
          <circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke="rgba(200,155,60,0.14)"
            strokeWidth="2"
          />
          <circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke="url(#scrollTopGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.2s linear" }}
          />
          <defs>
            <linearGradient id="scrollTopGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5dfa0" />
              <stop offset="55%" stopColor="#c89b3c" />
              <stop offset="100%" stopColor="#a67f2e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Arrow icon */}
        <span
          className="relative z-10 flex h-6 w-6 items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5"
          style={{ color: "#e0c584" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </span>

        {/* Hover glow */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle, rgba(200,155,60,0.28) 0%, transparent 70%)", transform: "scale(1.4)" }}
          aria-hidden
        />

        {/* Tooltip label */}
        <span
          className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold text-navy-dark opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-0"
          style={{
            background: "linear-gradient(135deg, #e0c584 0%, #c89b3c 100%)",
            boxShadow: "0 4px 16px rgba(200,155,60,0.35)",
            transform: "translateX(6px)",
          }}
        >
          Back to top
        </span>
      </button>

      <style>{`
        @keyframes scrollTopPulse {
          0%   { box-shadow: 0 0 0 0 rgba(200,155,60,0.55); opacity: 1; }
          70%  { box-shadow: 0 0 0 18px rgba(200,155,60,0); opacity: 0; }
          100% { box-shadow: 0 0 0 0 rgba(200,155,60,0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}