import type { Metadata } from "next";
import { FeaturesPageClient } from "@/components/marketing/FeaturesPageClient";

export const metadata: Metadata = {
  title: "Features — Palei Events",
  description:
    "Explore the features of Palei Events: event websites, RSVP, QR access, photo galleries, guest uploads, schedules, live updates and analytics.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return <FeaturesPageClient />;
}
