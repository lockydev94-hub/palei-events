import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export type ButtonProps = ButtonBaseProps &
  (
    | { href: string }
    | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  );

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-ivory hover:bg-navy-dark shadow-soft hover:shadow-card hover:-translate-y-0.5",
  secondary:
    "bg-gold text-navy-dark hover:bg-gold-light shadow-soft hover:shadow-card hover:-translate-y-0.5",
  outline:
    "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-ivory",
  ghost: "text-navy hover:bg-navy/5",
  light:
    "bg-ivory text-navy hover:bg-champagne shadow-soft hover:shadow-card hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
  lg: "text-lg px-8 py-4",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    const { href, ...linkRest } = rest;
    void linkRest;
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}