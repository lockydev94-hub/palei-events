"use client";

/**
 * Wrapper that only renders AnnouncementBanner outside /admin/*.
 * Admin chrome has its own layout and shouldn't be visually crowded by
 * marketing banners.
 */

import { usePathname } from "next/navigation";
import { AnnouncementBanner } from "./AnnouncementBanner";

export function PublicAnnouncementLayer() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (pathname.startsWith("/admin")) return null;
  return <AnnouncementBanner />;
}
