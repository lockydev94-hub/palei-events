import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { Event } from "@/data/events";
import { formatEventDate, formatTime } from "@/lib/utils";

interface EventInfoProps {
  event: Event;
}

export function EventInfo({ event }: EventInfoProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="rounded-2xl border border-navy/10 bg-warmWhite p-6 shadow-soft">
        <CalendarDays className="h-6 w-6 text-gold-dark" aria-hidden />
        <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-mutedText">
          Date
        </h3>
        <p className="mt-2 font-semibold text-navy">{formatEventDate(event.startDate)}</p>
        {event.endDate && (
          <p className="mt-1 text-sm text-mutedText">to {formatEventDate(event.endDate)}</p>
        )}
      </div>

      <div className="rounded-2xl border border-navy/10 bg-warmWhite p-6 shadow-soft">
        <Clock className="h-6 w-6 text-gold-dark" aria-hidden />
        <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-mutedText">
          Time
        </h3>
        <p className="mt-2 font-semibold text-navy">{formatTime(event.startDate)}</p>
      </div>

      <div className="rounded-2xl border border-navy/10 bg-warmWhite p-6 shadow-soft">
        <MapPin className="h-6 w-6 text-gold-dark" aria-hidden />
        <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-mutedText">
          Venue
        </h3>
        {event.venue ? (
          <>
            <p className="mt-2 font-semibold text-navy">{event.venue.name}</p>
            <p className="mt-1 text-sm text-mutedText">
              {event.venue.address}, {event.venue.city}
            </p>
          </>
        ) : (
          <p className="mt-2 font-semibold text-navy">To be announced</p>
        )}
      </div>
    </div>
  );
}