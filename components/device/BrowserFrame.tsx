import type { ReactNode } from "react";

interface BrowserFrameProps {
  url?: string;
  children: ReactNode;
  className?: string;
}

export function BrowserFrame({ url = "aarav-ananya-wedding", children, className = "" }: BrowserFrameProps) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-navy/10 bg-ivory shadow-elevated ${className}`}>
      <div className="flex items-center gap-3 border-b border-navy/10 bg-warmWhite px-5 py-3.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-rose/70" />
          <span className="h-3 w-3 rounded-full bg-gold/70" />
          <span className="h-3 w-3 rounded-full bg-sage/70" />
        </div>
        <div className="flex-1 truncate rounded-md bg-softGray px-4 py-1.5 text-xs text-mutedText">
          paleievents.com/e/{url}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}