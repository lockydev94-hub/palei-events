import type { Metadata } from "next";
import { TemplatesPageClient } from "@/components/marketing/TemplatesPageClient";

export const metadata: Metadata = {
  title: "Templates — Palei Events",
  description:
    "Browse beautiful event templates for weddings, birthdays, corporate events, schools, colleges and more. Every template is fully customisable.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  return <TemplatesPageClient />;
}
