"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface DecorativeAnimationProps {
  src: string;
  className?: string;
  opacity?: number;
  alt?: string;
}

/**
 * A small decorative animation placed in a corner/edge of a section.
 * Lazy-mounted and hidden under reduced motion.
 */
export function DecorativeAnimation({
  src,
  className,
  opacity = 0.35,
  alt = "",
}: DecorativeAnimationProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  const show = !reducedMotion && inView;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute overflow-hidden", className)}
    >
      {show && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="30vw"
          unoptimized
          className="object-contain"
          style={{ opacity }}
        />
      )}
    </div>
  );
}