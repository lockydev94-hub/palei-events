import type { Metadata } from "next";
import { CreateEventPageClient } from "@/components/create-event/CreateEventPageClient";

export const metadata: Metadata = {
  title: "Create an Event — Palei Events",
  description:
    "Create a beautiful digital event page for your wedding, birthday, corporate event, school or college celebration with Palei Events. Free to start.",
  alternates: { canonical: "/create-event" },
};

export default function CreateEventPage() {
  return <CreateEventPageClient />;
}
