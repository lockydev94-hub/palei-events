"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { animations, type AnimationKey } from "@/data/animations";

interface AnimatedBackgroundProps {
  animationKey: AnimationKey;
  className?: string;
  opacity?: number;
  priority?: boolean;
  ariaHidden?: boolean;
}

/**
 * Decorative animated background.
 * - Renders only when scrolled into view (IntersectionObserver).
 * - Hidden entirely for users who prefer reduced motion.
 * - Mounts a single <img> so one GIF can be used per section.
 */
export function AnimatedBackground({
  animationKey,
  className,
  opacity = 0.5,
  priority = false,
  ariaHidden = true,
}: AnimatedBackgroundProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  const src = animations[animationKey];
  const show = !reducedMotion && inView;

  return (
    <div
      ref={ref}
      aria-hidden={ariaHidden}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {show && (
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          unoptimized
          className="object-cover"
          style={{ opacity }}
        />
      )}
    </div>
  );
}