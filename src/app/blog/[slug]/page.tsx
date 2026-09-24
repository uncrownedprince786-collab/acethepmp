import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Post } from "@/content/post-types";
import { posts } from "@/content/posts";
import { ArticleBody } from "@/components/blog/article-body";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/disclaimer";
import { getPost, fmtPostDate } from "@/lib/blog";
import { pageMetadata, SITE } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = getPost(slug);
    if (!post) return {};
    const base = pageMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      keywords: post.keywords,
    });
    return {
      ...base,
      openGraph: {
        ...base.openGraph,
        type: "article",
        publishedTime: post.published,
        modifiedTime: post.updated ?? post.published,
      },
    };
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return notFound();

  const related = post.related
    .map((slug) => getPost(slug))
    .filter((p): p is Post => Boolean(p));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        ← All study guides
      </Link>

      <div className="mt-6">
        <Badge variant="outline">{post.category}</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {fmtPostDate(post.published)}
          {post.updated ? ` · updated ${fmtPostDate(post.updated)}` : ""} ·{" "}
          {post.readMinutes} min read
        </p>
      </div>

      <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
        {post.intro}
      </p>

      <ArticleBody post={post} />

      <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight">{post.cta.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {post.cta.body}
        </p>
        <Button asChild variant="cta" className="mt-5">
          <Link href={post.cta.href}>{post.cta.label}</Link>
        </Button>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold tracking-tight">Keep reading</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {p.category}
                </p>
                <h3 className="mt-1 text-sm font-semibold leading-snug">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <Disclaimer />
      </div>
    </article>
  );
}