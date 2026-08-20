import type { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
  className?: string;
}

export function MobileFrame({ children, className = "" }: MobileFrameProps) {
  return (
    <div
      className={`relative w-[300px] max-w-full overflow-hidden rounded-[2rem] border-[6px] border-navy bg-ivory shadow-elevated ${className}`}
    >
      <div className="flex items-center justify-center border-b border-navy/10 bg-warmWhite py-2" aria-hidden>
        <span className="h-1.5 w-16 rounded-full bg-navy/20" />
      </div>
      <div className="relative h-[560px] overflow-hidden">{children}</div>
    </div>
  );
}