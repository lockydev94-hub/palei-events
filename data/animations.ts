export const animations = {
  petals: "/animation/Floating Floral Petals.gif",
  particles: "/animation/Golden Light Particles.gif",
  confetti: "/animation/Floating Confetti.gif",
  bokeh: "/animation/Soft Golden Bokeh.gif",
  lightSweep: "/animation/Elegant Light Sweep.gif",
  abstract: "/animation/Floating Abstract Event Shapes.gif",
  odishaPattern: "/animation/Odisha Sambalpuri Pattern Motion.gif",
  celebrationRing: "/animation/Subtle Ring _ Celebration Wave.gif",
} as const;

export type AnimationKey = keyof typeof animations;

export const fullWidthAnimations = {
  odishaGolden: "/full-width-animation/PE-BG-01-golden-odisha.gif",
  odishaFlow: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
  celebration: "/full-width-animation/Full Background Animation 03.gif",
} as const;

export type FullWidthAnimationKey = keyof typeof fullWidthAnimations;

// Renamed file (no spaces) so browsers can fetch without URL-encoding issues
export const heroVideo = "/videos/hero/palei-events-hero.mp4";

export const heroPoster = "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif";
