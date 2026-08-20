import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { Container } from "./Container";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <Badge tone={tone === "light" ? "gold" : "navy"} className="mb-5">
          {eyebrow}
        </Badge>
      )}
      <h2
        className={cn(
          "font-display text-h2 font-semibold text-balance",
          tone === "light" ? "text-navy" : "text-ivory"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed text-pretty",
            tone === "light" ? "text-mutedText" : "text-ivory/80"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

interface SectionWrapProps {
  children: ReactNode;
  className?: string;
}

export function SectionWrap({ children, className }: SectionWrapProps) {
  return <Container className={className}>{children}</Container>;
}