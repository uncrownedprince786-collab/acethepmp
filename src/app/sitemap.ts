import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "/", priority: 1 },
    { path: "/diagnostic", priority: 0.9 },
    { path: "/curriculum", priority: 0.8 },
    { path: "/practice", priority: 0.8 },
    { path: "/simulator", priority: 0.8 },
    { path: "/flashcards", priority: 0.6 },
    { path: "/about", priority: 0.4 },
  ];

  return routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r.priority,
  }));
}