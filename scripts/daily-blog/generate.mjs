import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { log, todayISO, excerptFor, readMinutesFor } from "./core.mjs";
import { ingest } from "./ingest.mjs";
import { writeFallback } from "./writer-fallback.mjs";
import { writeWithLLM } from "./writer-llm.mjs";
import { validatePost } from "./validate.mjs";
import { readPostsTs, readSlugs, readPublished, appendPost, postToTs, writePostsTs } from "./serialize.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function args() {
  return {
    dryRun: process.argv.includes("--dry-run"),
    force: process.argv.includes("--force"),
    skipIngest: process.env.SKIP_INGEST === "1",
    topicIndex: (() => {
      const i = process.argv.indexOf("--topic");
      return i >= 0 ? Number(process.argv[i + 1]) : null;
    })(),
  };
}

function loadTopics() {
  return JSON.parse(readFileSync(join(__dirname, "seed-topics.json"), "utf8"));
}

function normalizePost(post, topic, today) {
  const out = structuredClone(post);
  out.published = today;
  out.keywords = (out.keywords || topic.keywords || [])
    .map((k) => String(k).toLowerCase().trim())
    .filter(Boolean)
    .slice(0, 6);
  out.category = ["Domain deep dive", "Exam process", "Exam format", "Study practice"].includes(out.category)
    ? out.category
    : topic.category;
  out.related = (out.related || topic.related || []).filter((s) => s !== out.slug).slice(0, 4);
  out.blocks = (out.blocks || [])
    .map((b) => {
      if (b.t === "list") {
        if (!Array.isArray(b.items)) return null;
        return { t: "list", items: b.items.filter((i) => typeof i === "string" && i.length > 3).slice(0, 12), ordered: !!b.ordered };
      }
      if (typeof b.text !== "string" || b.text.length < 3) return null;
      return { t: b.t, text: b.text };
    })
    .filter(Boolean);
  if (!out.cta || typeof out.cta !== "object") {
    out.cta = topic.cta;
  } else {
    out.cta = {
      title: out.cta.title || topic.cta.title,
      body: out.cta.body || topic.cta.body,
      href: out.cta.href || topic.cta.href,
      label: out.cta.label || topic.cta.label,
    };
  }
  if (!out.intro || out.intro.length < 80) out.intro = topic.angle;
  const bodyText = out.blocks.map((b) => (b.t === "list" ? b.items.join(" ") : b.text)).join(" ");
  if (!out.excerpt || out.excerpt.length < 120) out.excerpt = excerptFor(out.blocks);
  out.readMinutes = readMinutesFor(bodyText);
  return out;
}

async function main() {
  const opts = args();
  const today = todayISO();
  const topics = loadTopics();
  const ts = readPostsTs();
  const existing = readSlugs(ts);
  const publishedDates = readPublished(ts);
  if (publishedDates.has(today) && !opts.force) {
    log(`a post is already published for ${today} — nothing to do (exit 0)`);
    return;
  }
  const candidateIndex =
    opts.topicIndex != null ? opts.topicIndex : topics.findIndex((t) => !existing.has(t.slug));
  if (candidateIndex < 0 || candidateIndex >= topics.length) {
    log("no unused topic left — add more to seed-topics.json");
    if (opts.dryRun) return;
    process.exitCode = 1;
    return;
  }
  const topic = topics[candidateIndex];
  log(`topic #${candidateIndex} → ${topic.slug}`);

  let results = [];
  if (!opts.skipIngest) {
    results = await ingest(topic);
  }
  const sourceTexts = results.map((r) => r.text || "");

  let post = null;
  let used = null;
  post = await writeWithLLM({ topic, results });
  if (post) {
    post = normalizePost(post, topic, today);
    const v = validatePost(post, { existingSlugs: existing, sourceTexts });
    if (v.ok) {
      used = "llm";
    } else {
      log(`llm post failed validation (${v.errors.join("; ")}) — falling back`);
      post = null;
    }
  }
  if (!post) {
    post = writeFallback({ topic, results });
    post = normalizePost(post, topic, today);
    const v = validatePost(post, { existingSlugs: existing, sourceTexts });
    if (!v.ok) {
      for (const e of v.errors) log(`validate ✗ ${e}`);
      process.exitCode = 1;
      return;
    }
    used = "fallback";
  }

  log(`mode: ${used} · words ${countWords(post)} · ${post.blocks.length} blocks`);
  if (opts.dryRun) {
    log("dry-run — post written to stdout, not committed:");
    console.log(postToTs(post).replace(/^ {2}/gm, "    "));
    log(`slug: ${post.slug} (exists=${existing.has(post.slug)})`);
    return;
  }
  if (existing.has(post.slug)) {
    log(`slug already used (${post.slug}) — abort without writing`);
    process.exitCode = 1;
    return;
  }
  const next = appendPost(ts, postToTs(post));
  writePostsTs(next);
  log(`appended ${post.slug} to src/content/posts.ts`);
  log("remember: gates before commit — tsc --noEmit, then build");
}

function countWords(post) {
  return post.blocks.reduce((n, b) => n + (b.t === "list" ? b.items.join(" ").split(/\s+/).length : b.text.split(/\s+/).length), 0);
}

main().catch((err) => {
  log(`fatal: ${err.stack || err.message}`);
  process.exitCode = 1;
});