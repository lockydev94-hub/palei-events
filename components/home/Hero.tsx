import { HeroVideo } from "@/components/hero/HeroVideo";
import { HeroContent, ScrollIndicator } from "@/components/hero/HeroContent";

export function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden bg-navy-dark"
      aria-label="Palei Events introduction"
    >
      {/* Background video */}
      <HeroVideo />

      {/* === Layered gradient overlays === */}

      {/* 1. Primary dark read-zone — left-heavy, opens up on right */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(112deg, rgba(10,15,28,0.97) 0%, rgba(10,15,28,0.82) 32%, rgba(10,15,28,0.42) 56%, rgba(10,15,28,0.10) 76%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* 2. Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-52 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(10,15,28,0.90) 0%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* 3. Top nav fade */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,15,28,0.72) 0%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* 4. Gold ambient glow — upper right */}
      <div
        className="absolute -top-48 -right-48 pointer-events-none z-[1]"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,155,60,0.14) 0%, rgba(200,155,60,0.05) 45%, transparent 70%)",
          filter: "blur(20px)",
        }}
        aria-hidden
      />

      {/* 5. Purple depth accent — lower left */}
      <div
        className="absolute -bottom-32 -left-32 pointer-events-none z-[1]"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(155,122,203,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      {/* 6. Diagonal light beam — premium streak */}
      <div
        className="absolute pointer-events-none z-[1]"
        style={{
          top: "10%",
          left: "25%",
          width: "1px",
          height: "55%",
          background:
            "linear-gradient(to bottom, transparent, rgba(200,155,60,0.18) 40%, rgba(200,155,60,0.08) 70%, transparent)",
          transform: "rotate(-18deg) scaleY(1)",
          filter: "blur(1px)",
        }}
        aria-hidden
      />

      {/* 7. Subtle noise texture for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
        aria-hidden
      />

      {/* Content — above all overlays */}
      <div className="container-shell relative z-[2] w-full">
        <HeroContent />
      </div>

      <ScrollIndicator />
    </section>
  );
}
