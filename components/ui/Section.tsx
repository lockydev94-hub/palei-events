import type { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  padded?: boolean;
  ariaLabel?: string;
}

export function Section({ children, className, id, padded = true, ariaLabel }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(padded && "section-pad", "relative", className)}
    >
      <Container>{children}</Container>
    </section>
  );
}