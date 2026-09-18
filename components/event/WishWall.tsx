"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EmptyState } from "@/components/ui/EmptyState";

interface Wish {
  id?: string;
  name: string;
  relation?: string;
  message: string;
}

interface WishWallProps {
  /** Firestore event id — undefined for demo events (no live feed). */
  eventId?: string;
  /** uid of the event owner (stamped on each wish so the owner can manage them). */
  ownerId?: string;
  /** Static wishes from the event doc — used when there is no live feed. */
  initialWishes?: Wish[];
}

const AVATAR_COLORS = [
  "linear-gradient(135deg, #e88c9b, #c55b6d)",
  "linear-gradient(135deg, #9b7acb, #7054a8)",
  "linear-gradient(135deg, #c89b3c, #a67f2e)",
  "linear-gradient(135deg, #93a88a, #6b8762)",
  "linear-gradient(135deg, #f29b7a, #d07050)",
];

function WishCard({ wish, index }: { wish: Wish; index: number }) {
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
          &ldquo;
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
            <p className="text-[0.85rem] font-semibold truncate" style={{ color: "#a67f2e" }}>
              {wish.name}
            </p>
            {wish.relation && (
              <p className="text-[0.72rem] text-mutedText truncate mt-0.5">{wish.relation}</p>
            )}
          </div>
        </footer>
      </div>
    </blockquote>
  );
}

function WishComposer({
  eventId,
  ownerId,
  onPosted,
}: {
  eventId?: string;
  ownerId?: string;
  onPosted?: () => void;
}) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!eventId || !ownerId) return null; // demo events: wall only, no composer

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setState("sending");
    try {
      await addDoc(collection(db, "wishes"), {
        eventId,
        ownerId,
        name: name.trim(),
        relation: relation.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      setName("");
      setRelation("");
      setMessage("");
      setState("sent");
      onPosted?.();
    } catch (err) {
      console.warn("[wishes] write failed:", err);
      setState("error");
    }
  }

  const inputCls =
    "w-full rounded-xl px-4 py-3 text-[0.88rem] text-navy placeholder:text-mutedText/60 outline-none transition-all duration-200 focus:border-gold focus:ring-2 focus:ring-gold/15";
  const inputStyle = {
    background: "rgba(255,253,248,0.9)",
    border: "1px solid rgba(23,32,51,0.10)",
  };

  return (
    <form
      onSubmit={submit}
      className="mb-10 rounded-3xl p-6 sm:p-8"
      style={{
        background: "linear-gradient(135deg, rgba(200,155,60,0.07) 0%, rgba(255,253,248,0.95) 60%)",
        border: "1px solid rgba(200,155,60,0.16)",
        boxShadow: "0 6px 32px rgba(23,32,51,0.06)",
      }}
    >
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-dark mb-1">
        Leave a wish
      </p>
      <h3 className="font-display text-[1.15rem] font-semibold text-navy mb-5">
        Send your blessings
      </h3>

      {state === "sent" && (
        <p
          className="mb-4 rounded-xl px-4 py-3 text-[0.83rem]"
          style={{ background: "rgba(16,185,129,0.08)", color: "#047857" }}
          role="status"
        >
          Your wish is on the wall — thank you! ✨
        </p>
      )}
      {state === "error" && (
        <p
          className="mb-4 rounded-xl px-4 py-3 text-[0.83rem]"
          style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c" }}
          role="alert"
        >
          Couldn&apos;t post your wish. Please try again.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          maxLength={80}
          className={inputCls}
          style={inputStyle}
        />
        <input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="Relation (e.g. College friend)"
          maxLength={60}
          className={inputCls}
          style={inputStyle}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write something warm…"
          required
          rows={3}
          maxLength={500}
          className={`${inputCls} sm:col-span-2 resize-none`}
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[0.88rem] font-semibold text-navy-dark transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        style={{
          background: "linear-gradient(135deg, #e0c584, #c89b3c)",
          boxShadow: "0 0 24px rgba(200,155,60,0.35)",
        }}
      >
        {state === "sending" ? "Posting…" : "Post to the wall ✨"}
      </button>
    </form>
  );
}

export function WishWall({ eventId, ownerId, initialWishes = [] }: WishWallProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!eventId || !ownerId) return;
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setWishes(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Wish[]);
        setLive(true);
      },
      (err) => console.warn("[wishes] listener failed:", err)
    );
    return () => unsub();
  }, [eventId, ownerId]);

  return (
    <div>
      <WishComposer eventId={eventId} ownerId={ownerId} onPosted={() => setLive(true)} />
      {wishes.length === 0 ? (
        <EmptyState
          title="Be the first to wish."
          description="Messages from guests appear here as they're shared."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishes.map((wish, i) => (
            <WishCard key={wish.id ?? `${wish.name}-${i}`} wish={wish} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
