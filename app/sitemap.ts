import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";
import { demoEvents } from "@/data/events";
import { blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/solutions",
    "/features",
    "/templates",
    "/pricing",
    "/about",
    "/contact",
    "/blog",
    "/create-event",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${APP_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/privacy" || path === "/terms" ? 0.4 : 0.8,
  }));

  const eventRoutes = demoEvents.map((event) => ({
    url: `${APP_URL}/e/${event.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...eventRoutes, ...blogRoutes];
}