import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { posts } from "@/content/posts";

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
    { path: "/blog", priority: 0.5 },
  ];

  const blogPosts: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(`${p.updated ?? p.published}T00:00:00Z`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const coreRoutes: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r.priority,
  }));

  return [...coreRoutes, ...blogPosts];
}