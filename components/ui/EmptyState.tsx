import type { ReactNode } from "react";
import { ImageIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/20 bg-warmWhite px-8 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne/50 text-gold-dark">
        {icon ?? <ImageIcon className="h-7 w-7" aria-hidden />}
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold text-navy">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-mutedText">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}