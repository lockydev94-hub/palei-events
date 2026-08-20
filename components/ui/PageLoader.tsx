"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * PageLoader — two responsibilities:
 *
 * 1. INITIAL LOAD: shows immediately on first render (visible=true at init),
 *    then fades out once the client has hydrated and the page is interactive.
 *    This bridges the gap between the server-rendered shell and full hydration,
 *    preventing any flash of unstyled/blank content.
 *
 * 2. ROUTE CHANGES: shows briefly on each pathname change (SPA navigation).
 *
 * The `body { backgroundColor: #0f1522 }` inline style in layout.tsx ensures
 * even the very first server paint is dark — so there is zero white flash
 * before this component mounts.
 */
export function PageLoader() {
  const pathname = usePathname();

  // Start visible=true so it covers initial hydration immediately
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const isFirst = useRef(true);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startExit = (exitDelay: number) => {
    exitTimer.current = setTimeout(() => {
      setExiting(true);
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        setExiting(false);
      }, 550);
    }, exitDelay);
  };

  // Initial mount — hide after a short delay once hydration is done
  useEffect(() => {
    startExit(400);
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subsequent route changes
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    // Cancel any pending exit
    if (exitTimer.current) clearTimeout(exitTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);

    setExiting(false);
    setVisible(true);
    startExit(600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading page"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        backgroundColor: "#0f1522",
        opacity: exiting ? 0 : 1,
        transition: exiting
          ? "opacity 0.5s cubic-bezier(0.22,1,0.36,1)"
          : "none",
      }}
    >
      {/* Content wrapper — scales out on exit */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: exiting ? "scale(0.9) translateY(-6px)" : "scale(1) translateY(0)",
          opacity: exiting ? 0 : 1,
          transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
        }}
      >
        {/* Spinning arc + P mark */}
        <div style={{ position: "relative", width: 64, height: 64 }}>
          {/* Outer glow */}
          <div
            style={{
              position: "absolute",
              inset: -20,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,155,60,0.18) 0%, transparent 70%)",
              animation: "plPulse 1.8s ease-in-out infinite",
            }}
          />
          <svg
            viewBox="0 0 64 64"
            fill="none"
            style={{ width: 64, height: 64, animation: "plSpin 1.1s linear infinite" }}
          >
            <circle cx="32" cy="32" r="28" stroke="rgba(200,155,60,0.12)" strokeWidth="2" />
            <path
              d="M32 4 A28 28 0 0 1 60 32"
              stroke="url(#plGold)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="plGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e8d5a8" />
                <stop offset="100%" stopColor="#c89b3c" />
              </linearGradient>
            </defs>
          </svg>
          {/* P lettermark */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#e8d5a8",
              letterSpacing: "-0.04em",
            }}
          >
            P
          </span>
        </div>

        {/* Brand name */}
        <p
          style={{
            marginTop: 16,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(232,213,168,0.45)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Palei Events
        </p>

        {/* Dot progress */}
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: "#c89b3c",
                animation: `plDot 1.2s ease-in-out ${i * 180}ms infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes plSpin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes plPulse { 0%,100% { transform: scale(1); opacity:.5; } 50% { transform: scale(1.15); opacity:1; } }
        @keyframes plDot   { 0%,80%,100% { transform:scale(0.55); opacity:.3; } 40% { transform:scale(1); opacity:1; } }
      `}</style>
    </div>
  );
}
