import { EmptyState } from "@/components/ui/EmptyState";
import type { Event } from "@/data/events";

interface WishWallProps {
  event: Event;
}

const AVATAR_COLORS = [
  "linear-gradient(135deg, #e88c9b, #c55b6d)",
  "linear-gradient(135deg, #9b7acb, #7054a8)",
  "linear-gradient(135deg, #c89b3c, #a67f2e)",
  "linear-gradient(135deg, #93a88a, #6b8762)",
  "linear-gradient(135deg, #f29b7a, #d07050)",
];

function WishCard({
  wish,
  index,
}: {
  wish: { name: string; message: string; relation?: string };
  index: number;
}) {
  const initials = wish.name
    .split(/[\s&+,]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <blockquote
      className="group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(255,253,248,0.98)",
        border: "1px solid rgba(200,155,60,0.12)",
        boxShadow: "0 4px 24px rgba(23,32,51,0.07)",
      }}
    >
      {/* Top gold accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, transparent, #c89b3c, transparent)",
        }}
        aria-hidden
      />

      <div className="p-6">
        {/* Large decorative quote mark */}
        <div
          className="font-display font-bold leading-none select-none mb-3"
          style={{
            fontSize: "4rem",
            lineHeight: 0.8,
            background: "linear-gradient(135deg, #e0c584 0%, rgba(200,155,60,0.2) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          aria-hidden
        >
          "
        </div>

        <p className="font-display text-[1rem] leading-relaxed text-navy" style={{ fontStyle: "italic" }}>
          {wish.message}
        </p>

        {/* Author */}
        <footer className="mt-5 flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(200,155,60,0.12)" }}>
          <span
            className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-xl text-[0.7rem] font-bold text-white"
            style={{ background: avatarBg }}
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p
              className="text-[0.85rem] font-semibold truncate"
              style={{ color: "#a67f2e" }}
            >
              {wish.name}
            </p>
            {wish.relation && (
              <p className="text-[0.72rem] text-mutedText truncate mt-0.5">
                {wish.relation}
              </p>
            )}
          </div>
        </footer>
      </div>
    </blockquote>
  );
}

export function WishWall({ event }: WishWallProps) {
  if (event.wishes.length === 0) {
    return (
      <EmptyState
        title="Be the first to wish."
        description="Messages from guests appear here as they're shared."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {event.wishes.map((wish, i) => (
        <WishCard key={wish.name} wish={wish} index={i} />
      ))}
    </div>
  );
}
