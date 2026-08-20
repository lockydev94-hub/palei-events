import Image from "next/image";
import { eventTypeMeta, type Event } from "@/data/events";
import { formatEventDate } from "@/lib/utils";

interface EventHeroProps {
  event: Event;
}

/* Decorative corner ornament */
function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posMap = {
    tl: "top-8 left-8 rotate-0",
    tr: "top-8 right-8 rotate-90",
    bl: "bottom-8 left-8 -rotate-90",
    br: "bottom-8 right-8 rotate-180",
  };
  return (
    <svg
      className={`absolute ${posMap[position]} h-10 w-10 opacity-30 pointer-events-none hidden md:block`}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      <path d="M2 38 L2 2 L38 2" stroke="#c89b3c" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2" cy="2" r="2" fill="#c89b3c" />
    </svg>
  );
}

/* Ring motif SVG */
function RingMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function EventHero({ event }: EventHeroProps) {
  const typeMeta = eventTypeMeta[event.type];
  const theme = event.theme;
  const isWedding = event.type === "wedding";

  return (
    <section
      className="relative flex min-h-[88vh] items-end overflow-hidden"
      aria-label={`${event.name} event hero`}
    >
      {/* ── Background image / colour ── */}
      {event.heroImage ? (
        <Image
          src={event.heroImage}
          alt=""
          fill
          sizes="100vw"
          priority
          unoptimized
          className="object-cover"
          style={{ transform: "scale(1.04)" }}
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: theme.backgroundColor }} />
      )}

      {/* ── Multi-layer overlays for depth ── */}
      {/* base dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(175deg, rgba(10,14,26,0.25) 0%, rgba(10,14,26,0.50) 45%, rgba(10,14,26,0.92) 100%)",
        }}
        aria-hidden
      />
      {/* horizontal left band */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,14,26,0.55) 0%, transparent 55%)",
        }}
        aria-hidden
      />
      {/* top fade for nav */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,14,26,0.65) 0%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* gold ambient bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-72 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(10,14,26,1) 0%, rgba(10,14,26,0.70) 40%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* subtle gold bloom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 100%, rgba(200,155,60,0.12) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── Decorative corner ornaments ── */}
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      {/* ── Hero content ── */}
      <div className="container-shell relative z-10 pb-20 pt-40 w-full">
        <div className="max-w-3xl">

          {/* Eyebrow pill */}
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-7"
            style={{
              background: "rgba(200,155,60,0.14)",
              border: "1px solid rgba(200,155,60,0.35)",
              backdropFilter: "blur(10px)",
            }}
          >
            {isWedding && (
              <RingMotif className="h-3.5 w-3.5 text-gold-light opacity-80" />
            )}
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gold-light">
              {typeMeta.label}
            </span>
            {event.endDate && (
              <>
                <span className="w-px h-3 bg-gold/30" />
                <span className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-ivory/50">
                  Multi-day event
                </span>
              </>
            )}
          </div>

          {/* Event name */}
          <h1
            className="font-display font-semibold leading-[1.06] tracking-tight text-ivory text-balance"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
          >
            {isWedding ? (
              <>
                {/* Split name at & for better kerning */}
                {event.name.split("&").map((part, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <span
                        style={{
                          background:
                            "linear-gradient(110deg, #f0d080 0%, #c89b3c 60%, #f5dfa0 100%)",
                          backgroundSize: "180% auto",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          animation: "shimmerGold 4s linear infinite",
                          display: "inline",
                        }}
                      >
                        {" & "}
                      </span>
                    )}
                    {part.trim()}
                  </span>
                ))}
              </>
            ) : (
              event.name
            )}
          </h1>

          {/* Tagline */}
          <p
            className="mt-4 font-display italic leading-snug"
            style={{
              fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)",
              background:
                "linear-gradient(90deg, #f0d080 0%, #e0c584 60%, #c89b3c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {event.tagline}
          </p>

          {/* Ornament line */}
          <div className="flex items-center gap-3 mt-6" aria-hidden>
            <div
              style={{
                height: "1px",
                width: "40px",
                background: "linear-gradient(90deg, transparent, rgba(200,155,60,0.6))",
              }}
            />
            <svg className="h-3 w-3 text-gold/60" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C8 0 8.5 3.5 10 5.5C11.5 7.5 16 8 16 8C16 8 11.5 8.5 10 10.5C8.5 12.5 8 16 8 16C8 16 7.5 12.5 6 10.5C4.5 8.5 0 8 0 8C0 8 4.5 7.5 6 5.5C7.5 3.5 8 0 8 0Z" />
            </svg>
            <div
              style={{
                height: "1px",
                width: "40px",
                background: "linear-gradient(90deg, rgba(200,155,60,0.6), transparent)",
              }}
            />
          </div>

          {/* Date & venue row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
            {/* Date */}
            <div className="flex items-center gap-2.5">
              <span
                className="flex items-center justify-center h-7 w-7 rounded-lg flex-shrink-0"
                style={{ background: "rgba(200,155,60,0.16)" }}
              >
                <svg className="h-3.5 w-3.5 text-gold-light" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V8.75c0-.69-.56-1.25-1.25-1.25H4.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-[0.88rem] text-ivory/75 font-medium">
                {formatEventDate(event.startDate)}
              </span>
            </div>

            {/* Venue */}
            {event.venue && (
              <div className="flex items-center gap-2.5">
                <span
                  className="flex items-center justify-center h-7 w-7 rounded-lg flex-shrink-0"
                  style={{ background: "rgba(200,155,60,0.16)" }}
                >
                  <svg className="h-3.5 w-3.5 text-gold-light" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145 14.19 14.19 0 002.51-2.027c1.514-1.539 2.875-3.651 2.875-6.25a6 6 0 10-12 0c0 2.599 1.361 4.711 2.875 6.25a14.195 14.195 0 002.79 2.172l.018.008.006.003z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-[0.88rem] text-ivory/75 font-medium">
                  {event.venue.name}, {event.venue.city}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
