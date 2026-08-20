"use client";

import { useRef, useState, useEffect } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { heroVideo } from "@/data/animations";

/**
 * Full-screen hero background — VIDEO ONLY.
 * - bg-navy-dark shows while video buffers.
 * - Video fades in once playing.
 * - Reduced-motion users: static dark bg only.
 *
 * Fix: file was "Palei Events.mp4" (space = broken URL).
 * Now points to "palei-events-hero.mp4" (no space).
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Load explicitly so browsers don't defer
    video.load();

    const onCanPlay = () => {
      video.play().catch(() => {
        // Autoplay policy blocked — still show the video element (it renders 1st frame)
        setVideoReady(true);
      });
    };

    const onPlaying = () => setVideoReady(true);

    // canplaythrough gives a bit more buffer before revealing
    video.addEventListener("canplaythrough", onCanPlay);
    video.addEventListener("playing", onPlaying);

    return () => {
      video.removeEventListener("canplaythrough", onCanPlay);
      video.removeEventListener("playing", onPlaying);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-navy-dark">
      {!reducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
          style={{
            opacity: videoReady ? 1 : 0,
            transition: "opacity 1.2s ease",
            willChange: "opacity",
          }}
        >
          {/* Space-free filename so browser fetches correctly */}
          <source src={heroVideo} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
