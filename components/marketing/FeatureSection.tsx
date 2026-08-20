"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { useRef, useState } from "react";
import type { Feature } from "@/data/features";

interface FeatureSectionProps {
  feature: Feature;
  reverse?: boolean;
}

export function FeatureSection({ feature, reverse = false }: FeatureSectionProps) {
  const [tilted, setTilted] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8; // ±4°
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setTilted({ x, y });
  };

  const handleMouseLeave = () => setTilted({ x: 0, y: 0 });

  const isGif = feature.visual?.toLowerCase().endsWith(".gif");

  return (
    <div
      className={`grid items-center gap-12 lg:gap-20 lg:grid-cols-2 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Text side */}
      <div className="group/text">
        <Badge tone="gold" className="mb-5">
          {feature.category}
        </Badge>
        <h3 className="font-display text-h3 font-semibold text-navy text-balance leading-tight">
          {feature.title}
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-mutedText text-pretty">
          {feature.description}
        </p>

        {/* Feature pill */}
        <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-champagne/40 px-5 py-2.5 text-sm font-semibold text-gold-dark transition-all duration-300 hover:border-gold/50 hover:bg-champagne/70 hover:shadow-gold-glow cursor-default">
          <Icon name={feature.icon} className="h-4.5 w-4.5" />
          {feature.category}
        </div>

        {/* Animated underline accent */}
        <div className="mt-8 h-px w-0 bg-gradient-to-r from-gold/60 to-gold-light/20 transition-all duration-700 group/text:hover:w-full" />
      </div>

      {/* Visual side */}
      <div
        ref={imgRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative"
        style={{ perspective: "900px" }}
      >
        {/* 3-D tilt container */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `rotateY(${tilted.x}deg) rotateX(${tilted.y}deg)`,
          }}
        >
          <div className="group/img overflow-hidden rounded-2xl border border-navy/12 shadow-elevated">
            {feature.visual ? (
              <Image
                src={feature.visual}
                alt={feature.title}
                width={800}
                height={isGif ? 560 : 560}
                unoptimized
                className={`w-full object-cover transition-transform duration-700 group-hover/img:scale-105 ${
                  isGif ? "aspect-[4/3]" : ""
                }`}
                style={isGif ? { height: "auto" } : undefined}
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-navy p-12">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gold/20 transition-all duration-300 hover:scale-110 hover:bg-gold/30">
                  <Icon name={feature.icon} className="h-12 w-12 text-champagne" />
                </div>
              </div>
            )}

            {/* Shimmer overlay on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/img:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)",
              }}
            />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-xl border border-navy/10 bg-ivory px-4 py-2.5 shadow-card z-10 transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20">
              <Icon name={feature.icon} className="h-3.5 w-3.5 text-gold-dark" />
            </span>
            <span className="text-xs font-semibold text-navy/70">{feature.category}</span>
          </div>
        </div>

        {/* Glow blob behind the card */}
        <div
          className="pointer-events-none absolute -bottom-8 -right-8 -z-10 h-48 w-48 rounded-full blur-2xl transition-all duration-500"
          style={{ backgroundColor: "rgba(200,155,60,0.15)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-6 -top-6 -z-10 h-32 w-32 rounded-full blur-xl"
          style={{ backgroundColor: "rgba(200,155,60,0.08)" }}
          aria-hidden
        />
      </div>
    </div>
  );
}
