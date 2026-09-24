import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";

export function postsPath() {
  return join(ROOT, "src", "content", "posts.ts");
}

export function readPostsTs() {
  return readFileSync(postsPath(), "utf8");
}

export function readSlugs(ts) {
  const slugs = [];
  for (const m of ts.matchAll(/slug:\s*["']([^"']+)["']/g)) slugs.push(m[1]);
  return new Set(slugs);
}

export function readPublished(ts) {
  const dates = [];
  for (const m of ts.matchAll(/published:\s*["']([0-9-]+)["']/g)) dates.push(m[1]);
  return new Set(dates);
}

function q(s) {
  return JSON.stringify(s);
}

export function postToTs(post, indent = "  ") {
  const L = [];
  L.push(`${indent}{`);
  L.push(`${indent}  slug: ${q(post.slug)},`);
  L.push(`${indent}  title: ${q(post.title)},`);
  L.push(`${indent}  category: ${q(post.category)},`);
  L.push(`${indent}  excerpt: ${q(post.excerpt)},`);
  L.push(`${indent}  keywords: ${JSON.stringify(post.keywords)},`);
  L.push(`${indent}  published: ${q(post.published)},`);
  if (post.updated) L.push(`${indent}  updated: ${q(post.updated)},`);
  L.push(`${indent}  readMinutes: ${post.readMinutes},`);
  L.push(`${indent}  intro: ${q(post.intro)},`);
  L.push(`${indent}  cta: {`);
  L.push(`${indent}    title: ${q(post.cta.title)},`);
  L.push(`${indent}    body: ${q(post.cta.body)},`);
  L.push(`${indent}    href: ${q(post.cta.href)},`);
  L.push(`${indent}    label: ${q(post.cta.label)},`);
  L.push(`${indent}  },`);
  L.push(`${indent}  related: ${JSON.stringify(post.related)},`);
  L.push(`${indent}  blocks: [`);
  for (const b of post.blocks) {
    if (b.t === "list") {
      L.push(`${indent}    {`);
      L.push(`${indent}      t: "list",`);
      L.push(`${indent}      items: ${JSON.stringify(b.items)},`);
      if (b.ordered) L.push(`${indent}      ordered: true,`);
      L.push(`${indent}    },`);
    } else {
      L.push(`${indent}    {`);
      L.push(`${indent}      t: ${q(b.t)},`);
      L.push(`${indent}      text: ${q(b.text)},`);
      L.push(`${indent}    },`);
    }
  }
  L.push(`${indent}  ],`);
  L.push(`${indent}},`);
  return L.join("\n");
}

export function appendPost(ts, blocks) {
  const marker = /\n\];\s*$/;
  if (!marker.test(ts)) throw new Error("could not locate closing of posts array");
  return ts.replace(marker, `\n${blocks.trimEnd()}\n];`);
}

export function writePostsTs(ts) {
  writeFileSync(postsPath(), ts, "utf8");
}