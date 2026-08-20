"use client";

import { useEffect, useState } from "react";
import { getTimeUntil } from "@/lib/utils";

interface CountdownProps {
  targetDate: string;
  compact?: boolean;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative flex flex-col items-center group">
      {/* Outer ring */}
      <div
        className="relative flex items-center justify-center w-16 h-16 rounded-2xl sm:w-20 sm:h-20"
        style={{
          background:
            "linear-gradient(145deg, rgba(200,155,60,0.18) 0%, rgba(200,155,60,0.06) 100%)",
          border: "1px solid rgba(200,155,60,0.28)",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Gold corner accent top-left */}
        <span
          className="absolute top-0 left-0 w-3 h-3 pointer-events-none opacity-60"
          aria-hidden
          style={{
            borderTop: "1.5px solid rgba(200,155,60,0.7)",
            borderLeft: "1.5px solid rgba(200,155,60,0.7)",
            borderTopLeftRadius: "0.375rem",
          }}
        />
        {/* Gold corner accent bottom-right */}
        <span
          className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none opacity-60"
          aria-hidden
          style={{
            borderBottom: "1.5px solid rgba(200,155,60,0.7)",
            borderRight: "1.5px solid rgba(200,155,60,0.7)",
            borderBottomRightRadius: "0.375rem",
          }}
        />
        <span
          className="font-display font-bold tabular-nums"
          style={{
            fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
            lineHeight: 1,
            background:
              "linear-gradient(160deg, #f5dfa0 0%, #c89b3c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {pad(value)}
        </span>
      </div>
      <span
        className="mt-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-center"
        style={{ color: "rgba(23,32,51,0.45)" }}
      >
        {label}
      </span>
    </div>
  );
}

export function Countdown({ targetDate, compact = false }: CountdownProps) {
  const [time, setTime] = useState(() => getTimeUntil(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeUntil(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
  ];

  const total = time.days + time.hours + time.minutes + time.seconds;

  if (compact) {
    return (
      <p className="font-display text-lg font-semibold text-navy">
        {total === 0 ? "The celebration has begun!" : `${time.days} days to go`}
      </p>
    );
  }

  if (total === 0) {
    return (
      <p
        className="text-center font-display text-lg font-semibold py-4"
        style={{ color: "#c89b3c" }}
      >
        ✦ The celebration has begun!
      </p>
    );
  }

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-3"
      role="timer"
      aria-label="Countdown to the event"
    >
      {units.map((unit) => (
        <CountUnit key={unit.label} value={unit.value} label={unit.label} />
      ))}
    </div>
  );
}
