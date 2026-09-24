import Link from "next/link";
import type { ReactNode } from "react";
import type { Block, Post } from "@/content/post-types";

const INLINE_RE =
  /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]\n]+\]\([^)\n]+\))/g;
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/;

/** Renders the tiny inline syntax used by post content: **bold**, *italic*, [text](/path). */
function renderInline(text: string, key: string): ReactNode[] {
  return text.split(INLINE_RE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${key}-b${i}`}>{part.slice(2, -2)}</strong>
      );
    }
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${key}-i${i}`}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(LINK_RE);
    if (link) {
      const href = link[2];
      const isExternal = /^https?:\/\//.test(href);
      const cls =
        "font-medium text-[var(--brand-teal)] underline underline-offset-2 hover:brightness-90";
      if (isExternal) {
        return (
          <a
            key={`${key}-a${i}`}
            href={href}
            className={cls}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link[1]}
          </a>
        );
      }
      return (
        <Link key={`${key}-a${i}`} href={href} className={cls}>
          {link[1]}
        </Link>
      );
    }
    return <span key={`${key}-s${i}`}>{part}</span>;
  });
}

function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case "h2":
      return <h2 className="mt-10 text-2xl font-bold tracking-tight">{block.text}</h2>;
    case "p":
      return (
        <p className="mt-5 leading-relaxed text-muted-foreground">
          {renderInline(block.text, "p")}
        </p>
      );
    case "list": {
      const items = block.items.map((item, i) => (
        <li key={i} className="leading-relaxed text-muted-foreground">
          {renderInline(item, `li${i}`)}
        </li>
      ));
      return block.ordered ? (
        <ol className="mt-5 list-decimal space-y-2 pl-5">{items}</ol>
      ) : (
        <ul className="mt-5 list-disc space-y-2 pl-5">{items}</ul>
      );
    }
    case "callout":
      return (
        <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-card-foreground">
          {renderInline(block.text, "ct")}
        </div>
      );
  }
}

export function ArticleBody({ post }: { post: Post }) {
  return (
    <div className="text-base">
      {post.blocks.map((block, i) => (
        <BlockView key={`${post.slug}-${i}`} block={block} />
      ))}
    </div>
  );
}