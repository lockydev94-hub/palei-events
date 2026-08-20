import { Button } from "./Button";

interface NotFoundStateProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function NotFoundState({
  title = "This event is no longer available.",
  description = "It may have ended or the link may be out of date.",
  ctaLabel = "Explore Palei Events",
  ctaHref = "/",
}: NotFoundStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-semibold text-gold" aria-hidden>
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-navy">{title}</h1>
      <p className="mt-3 max-w-md text-mutedText">{description}</p>
      <div className="mt-8">
        <Button href={ctaHref} variant="primary" size="lg">
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}