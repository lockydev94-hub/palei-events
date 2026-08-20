import Image from "next/image";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Event } from "@/data/events";

interface GalleryGridProps {
  event: Event;
}

export function GalleryGrid({ event }: GalleryGridProps) {
  if (event.gallery.length === 0) {
    return (
      <EmptyState
        title="Memories are waiting to be added."
        description="Photos shared by the host and guests will appear here."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {event.gallery.map((item, index) => (
        <figure
          key={`${item.src}-${index}`}
          className="group relative aspect-square overflow-hidden rounded-2xl bg-navy"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-4 pt-10 text-xs text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {item.caption ?? item.alt}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}