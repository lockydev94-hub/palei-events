import type { Event } from "@/data/events";

interface VenueCardProps {
  event: Event;
}

export function VenueCard({ event }: VenueCardProps) {
  const venue = event.venue;
  if (!venue) return null;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapQuery)}`;

  return (
    <div
      className="overflow-hidden rounded-3xl"
      style={{
        background: "rgba(255,253,248,0.98)",
        border: "1px solid rgba(200,155,60,0.15)",
        boxShadow: "0 8px 32px rgba(23,32,51,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(200,155,60,0.10) 0%, rgba(200,155,60,0.03) 100%)",
          borderBottom: "1px solid rgba(200,155,60,0.12)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center h-11 w-11 rounded-2xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #172033 0%, #22304d 100%)",
              boxShadow: "0 4px 12px rgba(23,32,51,0.25)",
            }}
          >
            <svg className="h-5 w-5 text-gold-light" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-dark mb-0.5">
              Venue
            </p>
            <h3 className="font-display text-[1.05rem] font-semibold text-navy leading-snug">
              {venue.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="px-6 py-5">
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
            style={{ background: "#c89b3c" }}
            aria-hidden
          />
          <p className="text-[0.88rem] text-mutedText leading-relaxed">
            {venue.address}
            <br />
            <span className="font-medium text-navy/70">{venue.city}</span>
          </p>
        </div>
      </div>

      {/* CTA */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-2.5 px-6 py-4 text-[0.88rem] font-semibold transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #172033 0%, #22304d 100%)",
          color: "#e0c584",
          borderTop: "1px solid rgba(200,155,60,0.12)",
        }}
      >
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Open in Maps
        <svg
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
