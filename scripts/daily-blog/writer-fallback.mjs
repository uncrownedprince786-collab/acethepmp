import { excerptFor, readMinutesFor } from "./core.mjs";

function sourcesCallout(results) {
  const links = results.map((r) => `[${r.source.label}](${r.source.url})`);
  const extra = ["[PMI Examination Content Outline](https://www.pmi.org/certifications/project-management-pmp)"];
  const all = [...new Set([...links, ...extra])].slice(0, 5);
  return `**Sources.** ${all.join(" · ")}. Facts above come from official PMI material; the advice is ours, original and practical.`;
}

function liveSection(results) {
  const live = results.flatMap((r) =>
    (r.live || []).map((f) => ({ f, url: r.source.url, label: r.source.label }))
  );
  if (live.length === 0) return [];
  return [
    {
      t: "p",
      text: `**What PMI's own pages state today** — captured live from [${results[0].source.label}](${results[0].source.url}) on the day this was published:`,
    },
    {
      t: "list",
      items: live.slice(0, 4).map(({ f, label, url }) => `${f} *(via [${label}](${url}))*`),
    },
  ];
}

function practiceList() {
  return [
    "Take the [free 10-question diagnostic](/diagnostic) first to see your 2026 ECO domain split before anything else.",
    "Drill with [adaptive practice questions](/practice) that target your weakest domain and explain every answer.",
    "Run a full-length [exam simulator](/simulator) session to train the 180-question, 240-minute pace — two runs minimum.",
    "Browse the [curriculum](/curriculum) to confirm coverage of all 26 tasks across the three domains.",
  ];
}

export function writeFallback({ topic, results }) {
  const blocks = [
    {
      t: "p",
      text: `${topic.angle} That makes it one of the most practice-able slices of the 2026 exam: the scenarios follow recognizable patterns once you know what the question is really asking.`,
    },
    {
      t: "h2",
      text: "The official facts behind this topic",
    },
    {
      t: "list",
      items: topic.facts.map((f) => `${f}`),
    },
    ...liveSection(results),
    {
      t: "h2",
      text: "Why this matters on the 2026 exam",
    },
    {
      t: "p",
      text: `The exam is built entirely from the Examination Content Outline, so a topic like this appears as a scenario, never as a definition recall. Read the first line of every question for the delivery environment — predictive, agile, or hybrid — because the correct move depends on it.`,
    },
    {
      t: "h2",
      text: "How to prepare: judgment beats memorization",
    },
    {
      t: "list",
      items: topic.advice,
    },
    {
      t: "p",
      text: `**One sentence to keep.** ${topic.takeaway}`,
    },
    {
      t: "p",
      text: `Across all three domains, the exam rewards the same habits: treat scenarios as judgment calls, gather facts before you act, and choose the least dramatic constructive move. Study this topic the way you will be scored on it — through explained practice questions — and the patterns become recognizable.`,
    },
    {
      t: "h2",
      text: "Practice it free, today",
    },
    {
      t: "list",
      items: practiceList(),
    },
    {
      t: "callout",
      text: "**Honest note.** This guide is original, not affiliated with PMI or the PMP exam, and does not promise results. PMI does not publish a passing score, and every readiness number you see — including ours — is an estimate from practice material.",
    },
    {
      t: "callout",
      text: sourcesCallout(results),
    },
  ];
  const post = {
    slug: topic.slug,
    title: buildTitle(topic),
    category: topic.category,
    keywords: topic.keywords,
    intro: `${topic.angle} ${introTail()}`,
    cta: topic.cta,
    related: topic.related,
    blocks,
  };
  post.excerpt = excerptFor(blocks);
  post.readMinutes = readMinutesFor(
    blocks.map((b) => (b.t === "list" ? b.items.join(" ") : b.text)).join(" ")
  );
  return post;
}

function introTail() {
  return `This guide pulls the official facts together and turns them into a practical plan you can act on today.`;
}

function buildTitle(topic) {
  const word = (w) => {
    const low = w.toLowerCase();
    if (low === "pmp" || low === "eco") return low === "pmp" ? "PMP" : "ECO";
    return low.charAt(0).toUpperCase() + low.slice(1);
  };
  const base = topic.keywords[0]
    .split(" ")
    .map(word)
    .join(" ");
  const withYear = /20\d\d/.test(base) ? base : `${base} (2026)`;
  return withYear.length <= 65 ? withYear : base.slice(0, 62);
}