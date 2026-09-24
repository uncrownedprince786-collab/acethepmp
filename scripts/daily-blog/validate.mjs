import { stripMarkdownInline } from "./core.mjs";

const TOOL_PATHS = new Set(["/diagnostic", "/practice", "/simulator", "/curriculum", "/flashcards"]);
const INTERNAL_LINK_RE = /\[[^\]]+\]\((\/[^)]+)\)/g;

export function validatePost(post, { existingSlugs, sourceTexts }) {
  const errors = [];
  if (!post || typeof post !== "object") return { ok: false, errors: ["post is not an object"] };
  if (!post.slug) errors.push("missing slug");
  if (existingSlugs.has(post.slug)) errors.push(`duplicate slug: ${post.slug}`);
  if (!/^[a-z0-9-]+$/.test(post.slug)) errors.push("slug must be lowercase hyphens only");
  if (!post.title || post.title.length < 20 || post.title.length > 65) errors.push(`title length invalid (${post.title?.length})`);
  if (!post.excerpt || post.excerpt.length < 120 || post.excerpt.length > 170) errors.push(`excerpt length invalid (${post.excerpt?.length})`);
  if (!Array.isArray(post.keywords) || post.keywords.length < 3 || post.keywords.length > 6) errors.push("need 3-6 keywords");
  if (!post.intro || post.intro.length < 80) errors.push("intro too short");
  if (!post.cta || !post.cta.title || !post.cta.body || !post.cta.href || !post.cta.label) errors.push("cta incomplete");
  if (!post.cta || !TOOL_PATHS.has(post.cta.href)) errors.push(`cta href should be a tool page (${post.cta?.href})`);
  if (!Array.isArray(post.related) || post.related.length === 0) errors.push("need related slugs");
  if (typeof post.readMinutes !== "number" || post.readMinutes < 3 || post.readMinutes > 25) errors.push("readMinutes out of range");
  if (!Array.isArray(post.blocks) || post.blocks.length < 6) errors.push(`need >= 6 blocks (got ${post.blocks?.length})`);
  if (!Array.isArray(post.blocks)) return { ok: false, errors };

  const hasH2 = post.blocks.some((b) => b.t === "h2" && b.text);
  if (!hasH2) errors.push("need at least one h2");
  const hasList = post.blocks.some((b) => b.t === "list" && b.items.length >= 2);
  if (!hasList) errors.push("need at least one list with 2+ items");
  const callouts = post.blocks.filter((b) => b.t === "callout");
  if (callouts.length < 2) errors.push("need at least 2 callouts (disclaimer + sources)");
  if (!callouts.some((c) => /not affiliated|pmi does not publish/i.test(c.text))) errors.push("missing PMI disclaimer callout");
  if (!callouts.some((c) => /sources?/i.test(c.text))) errors.push("missing sources callout");

  const allText = post.blocks
    .map((b) => (b.t === "list" ? b.items.join(" ") : b.text))
    .join(" ");
  const links = [];
  for (const m of allText.matchAll(INTERNAL_LINK_RE)) links.push(m[1]);
  const toolLinks = links.filter((l) => TOOL_PATHS.has(l));
  if (toolLinks.length < 2) errors.push(`need 2+ internal tool links (got ${toolLinks.length})`);

  const proseText = stripMarkdownInline(
    post.blocks.filter((b) => b.t !== "list").map((b) => b.text).join(" ")
  ).toLowerCase();
  const overlap = checkOverlap(proseText, sourceTexts);
  if (overlap) errors.push(`near-verbatim overlap with source text: "${overlap}"`);
  return { ok: errors.length === 0, errors };
}

function checkOverlap(postText, sourceTexts) {
  if (!sourceTexts || sourceTexts.length === 0) return null;
  const grams = new Map();
  const tokens = postText.split(/\s+/).filter((w) => w.length > 3);
  for (let i = 0; i + 8 <= tokens.length; i++) {
    grams.set(tokens.slice(i, i + 8).join(" "), true);
  }
  for (const src of sourceTexts) {
    const st = src.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, " ").split(" ");
    for (let i = 0; i + 8 <= st.length; i++) {
      const g = st.slice(i, i + 8).join(" ");
      if (grams.has(g)) return g.slice(0, 120);
    }
  }
  return null;
}