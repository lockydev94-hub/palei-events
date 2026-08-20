import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  dark?: boolean;
  light?: boolean;
}

export function Logo({ dark = false, light = false }: LogoProps) {
  const onDark = dark || !light;
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Palei Events home">
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg font-display text-lg font-bold",
          onDark ? "bg-ivory/15 text-champagne ring-1 ring-ivory/30" : "bg-navy text-champagne"
        )}
        aria-hidden
      >
        P
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            onDark ? "text-ivory" : "text-navy"
          )}
        >
          Palei Events
        </span>
        <span
          className={cn(
            "text-[0.6rem] font-semibold uppercase tracking-[0.22em]",
            onDark ? "text-champagne" : "text-gold-dark"
          )}
        >
          Celebrate
        </span>
      </span>
    </Link>
  );
}