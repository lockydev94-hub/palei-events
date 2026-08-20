import Link from "next/link";
import type { Event } from "@/data/events";
import { site } from "@/data/site";

interface EventFooterProps {
  event: Event;
}

export function EventFooter({ event }: EventFooterProps) {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0f1522 0%, #172033 100%)",
        borderTop: "1px solid rgba(200,155,60,0.15)",
      }}
    >
      {/* Ambient gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 120%, rgba(200,155,60,0.08) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 py-12 text-center">
        {/* Ornament */}
        <div className="flex items-center justify-center gap-3 mb-6" aria-hidden>
          <div
            style={{
              height: "1px",
              width: "48px",
              background: "linear-gradient(90deg, transparent, rgba(200,155,60,0.4))",
            }}
          />
          <svg className="h-3.5 w-3.5 text-gold/50" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
          </svg>
          <div
            style={{
              height: "1px",
              width: "48px",
              background: "linear-gradient(90deg, rgba(200,155,60,0.4), transparent)",
            }}
          />
        </div>

        <p
          className="font-display italic"
          style={{ fontSize: "1.05rem", color: "rgba(255,253,248,0.45)" }}
        >
          {event.name} · {event.tagline}
        </p>

        <p className="mt-4 text-[0.8rem]" style={{ color: "rgba(255,253,248,0.28)" }}>
          Crafted with{" "}
          <span aria-hidden style={{ color: "#e88c9b" }}>
            ♥
          </span>{" "}
          by{" "}
          <Link
            href="/"
            className="font-semibold transition-colors duration-200"
            style={{ color: "rgba(200,155,60,0.70)" }}
          >
            {site.name}
          </Link>
        </p>
      </div>
    </footer>
  );
}
