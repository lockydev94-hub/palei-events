import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/20 bg-warmWhite px-8 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose/15 text-rose">
        <AlertTriangle className="h-7 w-7" aria-hidden />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold text-navy">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-mutedText">{description}</p>
      {onRetry && (
        <div className="mt-6">
          <Button onClick={onRetry} variant="outline" size="sm">
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}