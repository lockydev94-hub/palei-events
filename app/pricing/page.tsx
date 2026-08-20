import type { Metadata } from "next";
import { PricingPageClient } from "@/components/marketing/PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing — Palei Events",
  description:
    "Simple, transparent pricing for event pages — from a free basic page to enterprise plans for companies and institutions.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
