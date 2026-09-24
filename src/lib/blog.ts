import type { Post } from "@/content/post-types";
import { posts } from "@/content/posts";

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function sortPosts(list: Post[]): Post[] {
  return [...list].sort((a, b) => b.published.localeCompare(a.published));
}

export function fmtPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}