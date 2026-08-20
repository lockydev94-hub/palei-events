import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4" role="status">
      <Loader2 className="h-8 w-8 animate-spin text-gold" aria-hidden />
      <p className="text-sm text-mutedText">{label}</p>
    </div>
  );
}