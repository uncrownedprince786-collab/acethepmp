import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/content/posts";
import { sortPosts, fmtPostDate } from "@/lib/blog";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "PMP Blog & Study Guides 2026",
  description:
    "Free, original PMP study guides: 2026 exam format and cost facts, the 26 ECO tasks by domain, and no-paywall exam strategy from the team behind the free simulator.",
  path: "/blog",
  keywords: ["pmp blog", "pmp study guide", "pmp exam guide 2026"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Ace the PMP Blog",
  url: `${SITE.url}/blog`,
  description:
    "Free, original PMP study guides: 2026 exam format facts, the 26 ECO tasks by domain, and practical exam strategy.",
  blogPost: sortPosts(posts).map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    url: `${SITE.url}/blog/${p.slug}`,
    datePublished: p.published,
  })),
};

export default function BlogPage() {
  const sorted = sortPosts(posts);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-teal)]">
        Free study guides
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        PMP blog &amp; study guides
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Original, honest guides to the 2026 PMP exam — format facts, the 26 ECO
        tasks by domain, and study strategy that costs nothing.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {sorted.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
          >
            <Badge variant="outline">{p.category}</Badge>
            <h2 className="mt-3 text-lg font-bold leading-snug tracking-tight group-hover:text-primary">
              {p.title}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              {fmtPostDate(p.published)} · {p.readMinutes} min read
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {p.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}