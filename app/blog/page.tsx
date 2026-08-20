import type { Metadata } from "next";
import { BlogPageClient } from "@/components/blog/BlogPageClient";

export const metadata: Metadata = {
  title: "Blog & Resources — Palei Events",
  description:
    "Guides and ideas for creating memorable digital event experiences — weddings, schools, corporate events, college fests and more.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
