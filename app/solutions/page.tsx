import type { Metadata } from "next";
import { SolutionsPageClient } from "@/components/marketing/SolutionsPageClient";

export const metadata: Metadata = {
  title: "Solutions — Palei Events",
  description:
    "Palei Events solutions for individuals, photographers, event planners, companies, schools, colleges and institutions.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return <SolutionsPageClient />;
}
