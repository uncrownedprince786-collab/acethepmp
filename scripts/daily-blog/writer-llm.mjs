import { log } from "./core.mjs";

const INTERNAL_LINKS = [
  "/diagnostic",
  "/practice",
  "/simulator",
  "/curriculum",
  "/flashcards",
];

const SYSTEM_PROMPT = `You write daily study guides for ace-the-pmp: a free, honest PMP prep site.

HOUSE RULES (non-negotiable):
- Only state facts that appear in the Facts I provide. Never invent numbers, dates, or stats. Never copy supplier text verbatim.
- Be direct, plain, second-person ("you"). Short sentences. No hype, no "unlock", no clickbait.
- Structurally, the guide must read like original SEO content for the 2026 PMP exam and include:
  - A list block with the official Facts.
  - At least two advice list items, written as practical judgment.
  - Exactly one callout titled "Honest note" stating: original content, not affiliated with PMI, PMI does not publish a passing score, and readiness scores are estimates.
  - Exactly one callout that lists "Sources" using inline links [PMI](url).
  - At least 2 but no more than 4 internal links to these pages: ${INTERNAL_LINKS.join(", ")} (use inline [text](/path) syntax; also link any related blog slug given with /blog/slug).
- Title: under 62 characters, lowercased primary keyword near the front, ends without punctuation.
- Excerpt: 140-165 characters, one sentence, no markdown.
- Keywords: 3-6 lowercase terms, no brand spam.
- Intro: 2-3 sentences setting the honest angle.
- Read the recommended reading minutes off the final block count (target 700-1100 words total).
- Inline syntax allowed: **bold**, *italic*, [text](/path).
- Category: "Domain deep dive" | "Exam process" | "Exam format" | "Study practice".

OUTPUT FORMAT: respond with ONLY a JSON object, no code fences, in exactly this shape:
{
  "slug": "string",
  "title": "string",
  "category": "string",
  "excerpt": "string",
  "keywords": ["string"],
  "intro": "string",
  "cta": { "title": "string", "body": "string", "href": "string", "label": "string" },
  "related": ["slug"],
  "blocks": [ { "t": "p", "text": "string" } | { "t": "h2", "text": "string" } | { "t": "list", "items": ["string"] } | { "t": "callout", "text": "string" } ]
}`;

function buildUserPrompt({ topic, results }) {
  const facts = [
    ...topic.facts,
    ...results.flatMap((r) => (r.live || []).map((f) => `${f} [${r.source.label}]( ${r.source.url})`)),
  ];
  const sources = results.map((r) => `<${r.source.label}: ${r.source.url}>`).join(", ");
  return JSON.stringify(
    {
      topic: {
        slug: topic.slug,
        category: topic.category,
        keywords: topic.keywords,
        angle: topic.angle,
        advice: topic.advice,
        takeaway: topic.takeaway,
        cta: topic.cta,
        related: topic.related,
      },
      officialFactsYouMayUseVerbatimAsNumbers: facts,
      sources,
      constraints: {
        slugMustBe: topic.slug,
        publishedDate: "leave blank; the pipeline sets it",
      },
    },
    null,
    2
  );
}

function parseJson(raw) {
  const text = String(raw)
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "");
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
    throw new Error("no JSON found in model output");
  }
}

export async function writeWithLLM({ topic, results }) {
  const apiKey = process.env.DAILY_BLOG_API_KEY;
  if (!apiKey) return null;
  const base = (process.env.DAILY_BLOG_BASE_URL || "https://openrouter.ai/api/v1").replace(/\/+$/, "");
  const model = process.env.DAILY_BLOG_MODEL || "meta-llama/llama-4-maverick:free";
  const body = {
    model,
    temperature: 0.7,
    max_tokens: 2600,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt({ topic, results }) },
    ],
  };
  log(`calling llm ${model}`);
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      log(`llm http ${res.status}: ${detail.slice(0, 300)}`);
      return null;
    }
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;
    const post = parseJson(content);
    return normalize(post);
  } catch (err) {
    log(`llm error: ${err.message}`);
    return null;
  }
}

function normalize(post) {
  if (!post || typeof post !== "object") return null;
  if (!Array.isArray(post.blocks) || post.blocks.length < 6) return null;
  post.blocks = post.blocks.map((b) => {
    if (b.t === "list" && !Array.isArray(b.items)) return null;
    return b;
  }).filter(Boolean);
  return post;
}