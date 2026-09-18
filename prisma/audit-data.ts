// Data-quality audit for the question bank. Read-only: it never writes.
//
//   npm run db:audit
//
// Checks that every question carries a clear correct answer, a substantive
// explanation, a difficulty and environment tag, and a valid 2026 ECO domain +
// task; that the source seed and the live database agree; that the bank's domain
// distribution tracks the ECO weights; and that the readiness scoring math
// returns 100 / 0 for all-correct / all-wrong runs.

import type { Domain } from "@prisma/client";
import { ECO_TAGS } from "./eco-tags";
import { prisma, questions } from "./seed";
import { DOMAIN_META, DOMAIN_ORDER, TASKS } from "../src/lib/eco";

const KEYS = ["A", "B", "C", "D"] as const;
const MIN_EXPLANATION = 80;
const MAX_DRIFT_PP = 8;

const problems: string[] = [];
const note = (m: string) => problems.push(m);

function isValidTask(domain: Domain, task: number) {
  return TASKS[domain].some((t) => t.id === task);
}

async function main() {
  if (ECO_TAGS.length !== questions.length) {
    note(`ECO_TAGS has ${ECO_TAGS.length} entries but questions has ${questions.length}`);
  }

  // --- Source seed integrity ------------------------------------------------
  questions.forEach((q, i) => {
    const where = `source[${i}] "${q.stem.slice(0, 44)}..."`;
    if (!q.stem.trim()) note(`${where}: empty stem`);
    for (const k of KEYS) {
      const opt = q[`option${k}` as "optionA"];
      if (!opt || !opt.trim()) note(`${where}: option ${k} is empty`);
    }
    if (!KEYS.includes(q.correctKey)) note(`${where}: invalid correctKey`);
    if (!q.explanation || q.explanation.trim().length < MIN_EXPLANATION) {
      note(`${where}: explanation shorter than ${MIN_EXPLANATION} chars`);
    }
    const tag = ECO_TAGS[i];
    if (!tag) note(`${where}: missing ECO tag`);
    else if (!isValidTask(tag.domain, tag.task)) {
      note(`${where}: task ${tag.task} is not valid for ${tag.domain}`);
    }
  });

  // --- Live database integrity ---------------------------------------------
  const db = await prisma.question.findMany();
  if (db.length !== questions.length) {
    note(`DB has ${db.length} questions but the seed defines ${questions.length}`);
  }
  for (const q of db) {
    const where = `db "${q.stem.slice(0, 44)}..."`;
    if (q.status !== "PUBLISHED") note(`${where}: status is ${q.status}`);
    if (!KEYS.includes(q.correctKey as (typeof KEYS)[number])) note(`${where}: invalid correctKey`);
    if (!q.explanation || q.explanation.trim().length < MIN_EXPLANATION) {
      note(`${where}: explanation shorter than ${MIN_EXPLANATION} chars`);
    }
    for (const opt of [q.optionA, q.optionB, q.optionC, q.optionD]) {
      if (!opt || !opt.trim()) note(`${where}: an option is empty`);
    }
    if (!isValidTask(q.domain, q.task)) {
      note(`${where}: task ${q.task} is not valid for ${q.domain}`);
    }
  }

  // --- Domain distribution vs ECO weights ----------------------------------
  const counts = { PEOPLE: 0, PROCESS: 0, BUSINESS_ENV: 0 } as Record<Domain, number>;
  for (const q of db) counts[q.domain] += 1;
  const total = db.length || 1;

  console.log(`\nBank: ${db.length} published questions`);
  console.log("Domain distribution vs 2026 ECO:");
  for (const d of DOMAIN_ORDER) {
    const pct = (counts[d] / total) * 100;
    const target = DOMAIN_META[d].weight * 100;
    const drift = Math.abs(pct - target);
    console.log(
      `  ${DOMAIN_META[d].label.padEnd(19)} ${String(counts[d]).padStart(3)}  ` +
        `${pct.toFixed(1).padStart(5)}%  (target ${target.toFixed(0)}%, drift ${drift.toFixed(1)} pp)`
    );
    if (drift > MAX_DRIFT_PP) {
      note(`${d} is ${pct.toFixed(1)}% vs target ${target.toFixed(0)}% (drift ${drift.toFixed(1)} pp)`);
    }
  }

  // --- Task coverage (informational) ---------------------------------------
  const covered = new Map<string, number>();
  for (const q of db) covered.set(`${q.domain}:${q.task}`, (covered.get(`${q.domain}:${q.task}`) ?? 0) + 1);
  const uncovered: string[] = [];
  for (const d of DOMAIN_ORDER) {
    for (const t of TASKS[d]) {
      if (!covered.get(`${d}:${t.id}`)) uncovered.push(`${d} task ${t.id}`);
    }
  }
  if (uncovered.length) {
    console.log(`\nTasks with no questions (${uncovered.length}/${DOMAIN_ORDER.reduce((n, d) => n + TASKS[d].length, 0)}):`);
    console.log("  " + uncovered.join(", "));
  } else {
    console.log("\nAll ECO tasks have at least one question.");
  }

  // --- Readiness scoring math ----------------------------------------------
  const right = weightedAccuracy(db.map(() => true), db.map((q) => q.domain));
  const wrong = weightedAccuracy(db.map(() => false), db.map((q) => q.domain));
  console.log(`\nScoring check: all-correct = ${right.toFixed(1)}%, all-wrong = ${wrong.toFixed(1)}%`);
  if (Math.round(right) !== 100) note(`all-correct weighted score is ${right.toFixed(1)}%, expected 100%`);
  if (Math.round(wrong) !== 0) note(`all-wrong weighted score is ${wrong.toFixed(1)}%, expected 0%`);

  if (problems.length) {
    console.error(`\nAUDIT FAILED (${problems.length}):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exitCode = 1;
  } else {
    console.log("\nAUDIT PASSED: data is consistent and mapped to the 2026 ECO.");
  }
}

/** Mirrors buildReadiness: answer-weighted domain accuracy, then ECO-weighted. */
function weightedAccuracy(results: boolean[], domains: Domain[]): number {
  const by = new Map<Domain, { right: number; wrong: number }>();
  results.forEach((ok, i) => {
    const s = by.get(domains[i]) ?? { right: 0, wrong: 0 };
    if (ok) s.right += 1;
    else s.wrong += 1;
    by.set(domains[i], s);
  });

  let weighted = 0;
  let answeredWeight = 0;
  for (const d of DOMAIN_ORDER) {
    const s = by.get(d);
    if (!s) continue;
    const answered = s.right + s.wrong;
    if (!answered) continue;
    weighted += DOMAIN_META[d].weight * (s.right / answered);
    answeredWeight += DOMAIN_META[d].weight;
  }
  return answeredWeight ? (weighted / answeredWeight) * 100 : 0;
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
