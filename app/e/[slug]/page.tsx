import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventHero } from "@/components/event/EventHero";
import { Countdown } from "@/components/event/Countdown";
import { EventSchedule } from "@/components/event/EventSchedule";
import { VenueCard } from "@/components/event/VenueCard";
import { GalleryGrid } from "@/components/event/GalleryGrid";
import { WishWall } from "@/components/event/WishWall";
import { RSVPForm } from "@/components/event/RSVPForm";
import { EventFooter } from "@/components/event/EventFooter";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { demoEvents } from "@/data/events";
import { APP_URL } from "@/lib/constants";

/**
 * Load event data — tries Firestore first, falls back to hardcoded demoEvents.
 * This runs server-side so it can safely import Firestore.
 */
async function getEvent(slug: string) {
  try {
    // Dynamic import to avoid bundling firebase-admin in client chunks
    const { getEventBySlug } = await import("@/lib/firestore");
    const event = await getEventBySlug(slug);
    if (event) return event;
  } catch (err) {
    // Firestore unavailable — fall back silently
  }
  // Fallback to hardcoded demo data
  return demoEvents.find((e) => e.slug === slug) || null;
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return demoEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };

  return {
    title: `${event.name} — ${event.tagline}`,
    description: event.description,
    alternates: { canonical: `/e/${event.slug}` },
    openGraph: {
      title: `${event.name} — ${event.tagline}`,
      description: event.description,
      url: `${APP_URL}/e/${event.slug}`,
      type: "website",
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: event.theme.backgroundColor }}>
      {/* ── Hero ── */}
      <EventHero event={event} />

      {/* ── Main content area ── */}
      <Container className="section-pad pt-14 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.65fr_1fr] lg:gap-14">

          {/* LEFT column */}
          <div className="space-y-16">

            {/* About */}
            <section aria-label="About the event">
              <SectionHeading
                eyebrow="About this event"
                title={event.tagline}
                align="left"
              />
              <p className="mt-5 max-w-2xl text-[1.05rem] leading-[1.85] text-mutedText text-pretty">
                {event.description}
              </p>
            </section>

            {/* Schedule */}
            <section aria-label="Event schedule">
              <SectionHeading
                eyebrow="Schedule"
                title="Programme"
                align="left"
              />
              <div className="mt-8">
                <EventSchedule event={event} />
              </div>
            </section>

            {/* Gallery */}
            <section aria-label="Event gallery">
              <SectionHeading
                eyebrow="Gallery"
                title="Moments"
                align="left"
              />
              <div className="mt-8">
                <GalleryGrid event={event} />
              </div>
            </section>

            {/* Wishes */}
            <section aria-label="Guest wishes">
              <SectionHeading
                eyebrow="Guest wishes"
                title="From our guests"
                align="left"
              />
              <div className="mt-8">
                <WishWall event={event} />
              </div>
            </section>
          </div>

          {/* RIGHT sidebar */}
          <aside className="space-y-6">
            {/* Countdown card */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255,253,248,0.96)",
                border: "1px solid rgba(200,155,60,0.14)",
                boxShadow: "0 8px 40px rgba(23,32,51,0.07)",
              }}
            >
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
                    className="flex items-center justify-center h-10 w-10 rounded-xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #172033, #22304d)",
                    }}
                  >
                    <svg className="h-4.5 w-4.5 text-gold-light" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-dark mb-0.5">
                      Countdown
                    </p>
                    <h3 className="font-display text-[1.05rem] font-semibold text-navy leading-none">
                      Mark your calendar
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Countdown targetDate={event.startDate} />
              </div>
            </div>

            {/* Venue card */}
            <VenueCard event={event} />
          </aside>
        </div>
      </Container>

      {/* ── RSVP section ── */}
      <section
        className="relative overflow-hidden py-20"
        aria-label="RSVP"
        style={{
          background:
            "linear-gradient(160deg, rgba(200,155,60,0.04) 0%, rgba(255,253,248,1) 40%, rgba(255,253,248,1) 100%)",
          borderTop: "1px solid rgba(200,155,60,0.10)",
        }}
      >
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(200,155,60,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <SectionHeading
            eyebrow="RSVP"
            title="Will you join us?"
            description="Let us know who's coming — it helps us plan a better celebration."
          />
          <div className="mx-auto mt-10 max-w-2xl">
            <RSVPForm eventName={event.name} />
          </div>
        </Container>
      </section>

      <EventFooter event={event} />
    </div>
  );
}
