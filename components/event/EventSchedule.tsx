import type { Event } from "@/data/events";

interface EventScheduleProps {
  event: Event;
}

const SCHEDULE_ICONS = [
  /* welcome / reception */
  <svg key="welcome" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>,
  /* ceremony */
  <svg key="ring" className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden><circle cx="7" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
  /* vows */
  <svg key="heart" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/></svg>,
  /* dinner */
  <svg key="dinner" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path d="M9 6a1 1 0 00-1 1v5a1 1 0 001 1h2a1 1 0 001-1V7a1 1 0 00-1-1H9zM4 5a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm10 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"/></svg>,
];

export function EventSchedule({ event }: EventScheduleProps) {
  if (event.schedule.length === 0) return null;

  return (
    <ol className="relative space-y-0" aria-label="Event schedule">
      {event.schedule.map((item, index) => {
        const isLast = index === event.schedule.length - 1;
        const icon = SCHEDULE_ICONS[index % SCHEDULE_ICONS.length];

        return (
          <li key={item.title} className="relative flex gap-4 group">
            {/* Vertical connector line */}
            {!isLast && (
              <div
                className="absolute left-[1.375rem] top-12 w-px bottom-0 z-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(200,155,60,0.4), rgba(200,155,60,0.08))",
                }}
                aria-hidden
              />
            )}

            {/* Icon node */}
            <div className="relative z-10 flex-shrink-0 mt-4">
              <div
                className="flex items-center justify-center h-11 w-11 rounded-2xl transition-all duration-300 group-hover:scale-105"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(200,155,60,0.2) 0%, rgba(200,155,60,0.08) 100%)",
                  border: "1px solid rgba(200,155,60,0.30)",
                  boxShadow: "0 2px 12px rgba(200,155,60,0.1)",
                  color: "#c89b3c",
                }}
              >
                {icon}
              </div>
            </div>

            {/* Card */}
            <div
              className="flex-1 mb-5 rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-0.5"
              style={{
                background: "rgba(255,253,248,0.95)",
                border: "1px solid rgba(200,155,60,0.10)",
                boxShadow: "0 2px 16px rgba(23,32,51,0.06)",
              }}
            >
              {/* top accent */}
              <div
                className="h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(200,155,60,0.5), transparent)",
                }}
                aria-hidden
              />
              <div className="p-5">
                <span
                  className="inline-flex items-center rounded-lg px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] mb-2"
                  style={{
                    background: "rgba(200,155,60,0.10)",
                    color: "#a67f2e",
                  }}
                >
                  {item.time}
                </span>
                <h3 className="font-display text-[1.05rem] font-semibold text-navy leading-snug">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1.5 text-[0.84rem] text-mutedText leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
