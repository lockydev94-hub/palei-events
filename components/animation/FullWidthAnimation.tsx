"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { fullWidthAnimations, type FullWidthAnimationKey } from "@/data/animations";

interface FullWidthAnimatedSectionProps {
  animationKey: FullWidthAnimationKey;
  children: ReactNode;
  className?: string;
  overlay?: "light" | "dark" | "none";
  overlayOpacity?: number;
  minHeight?: string;
  id?: string;
}

/**
 * Full-width section with an animated GIF background and an overlay for readability.
 * Never used more than once per page by design (see data mapping).
 */
export function FullWidthAnimatedSection({
  animationKey,
  children,
  className,
  overlay = "dark",
  overlayOpacity = 0.75,
  minHeight = "min-h-[70vh]",
  id,
}: FullWidthAnimatedSectionProps) {
  const [ref, inView] = useInView<HTMLElement>();
  const reducedMotion = useReducedMotion();

  const src = fullWidthAnimations[animationKey];
  const show = !reducedMotion && inView;

  const overlayStyles =
    overlay === "dark"
      ? { backgroundColor: `rgba(15, 21, 34, ${overlayOpacity})` }
      : overlay === "light"
        ? { backgroundColor: `rgba(255, 253, 248, ${overlayOpacity})` }
        : undefined;

  return (
    <section
      id={id}
      ref={ref}
      className={cn("relative flex items-center overflow-hidden", minHeight, className)}
    >
      {show && (
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          unoptimized
          priority={false}
          aria-hidden
          className="object-cover"
        />
      )}
      {!show && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: "#172033" }}
        />
      )}
      {overlay !== "none" && <div aria-hidden className="absolute inset-0" style={overlayStyles} />}
      <div className="container-shell relative z-10">{children}</div>
    </section>
  );
}