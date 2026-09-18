import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, withSessionCookie } from "@/lib/api-helpers";
import { EXAM_CONFIG, DOMAIN_ORDER, DOMAIN_META } from "@/lib/eco";
import type { Domain } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * Exam simulator.
 *
 * - `GET /api/simulator` returns an exam set sampled to the 2026 ECO domain
 *   proportions (People 33% / Process 41% / Business Environment 26%). Once the
 *   bank holds at least 180 published questions this is a true full-length mock;
 *   with a smaller bank the whole bank is returned so no content is hidden, and
 *   the domain mix still matches the bank's own distribution.
 * - `GET /api/simulator?meta=1` returns only the timing config and per-domain
 *   bank counts, for the intro screen.
 */
export async function GET(req: NextRequest) {
  const { sessionId, cookie } = await resolveSession();
  void sessionId;

  const questions = await prisma.question.findMany({ where: { status: "PUBLISHED" } });

  const buckets = new Map<Domain, typeof questions>();
  const available = new Map<Domain, number>();
  for (const d of DOMAIN_ORDER) {
    buckets.set(d, []);
    available.set(d, 0);
  }
  for (const q of questions) {
    buckets.get(q.domain)?.push(q);
  }
  for (const d of DOMAIN_ORDER) available.set(d, buckets.get(d)!.length);

  if (req.nextUrl.searchParams.get("meta") === "1") {
    const res = NextResponse.json({
      ok: true,
      total: questions.length,
      examLength: EXAM_CONFIG.totalQuestions,
      durationMinutes: EXAM_CONFIG.durationMinutes,
      breakAfterQuestions: EXAM_CONFIG.breakAfterQuestions,
      breakMinutes: EXAM_CONFIG.breakMinutes,
      domainCounts: Object.fromEntries(
        DOMAIN_ORDER.map((d) => [d, available.get(d)!])
      ),
    });
    return withSessionCookie(res, cookie);
  }

  // Serve the full 180-question exam once the bank is large enough, otherwise
  // the entire bank.
  const target = Math.min(EXAM_CONFIG.totalQuestions, questions.length);
  const counts = proportionalCounts(target, available);

  const selected: typeof questions = [];
  for (const d of DOMAIN_ORDER) {
    const bucket = [...buckets.get(d)!];
    shuffle(bucket);
    selected.push(...bucket.slice(0, counts.get(d)!));
  }
  const ordered = interleaveByDomain(selected);

  const payload = ordered.map((q) => ({
    id: q.id,
    stem: q.stem,
    options: { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD },
    domain: q.domain,
    task: q.task,
    envType: q.envType,
    difficulty: q.difficulty,
  }));

  const res = NextResponse.json({
    ok: true,
    total: questions.length,
    examLength: EXAM_CONFIG.totalQuestions,
    durationMinutes: EXAM_CONFIG.durationMinutes,
    breakAfterQuestions: EXAM_CONFIG.breakAfterQuestions,
    breakMinutes: EXAM_CONFIG.breakMinutes,
    questions: payload,
  });
  return withSessionCookie(res, cookie);
}

/**
 * Largest-remainder allocation of `total` slots across domains using the ECO
 * weights, capped by what each domain actually has. Any slots left over after
 * the caps (or after flooring) are handed out to domains that still have supply,
 * so a small bank is used in full rather than truncated to hit an exact ratio.
 */
function proportionalCounts(
  total: number,
  available: Map<Domain, number>
): Map<Domain, number> {
  const counts = new Map<Domain, number>();
  const remainders: { d: Domain; frac: number }[] = [];
  let assigned = 0;

  for (const d of DOMAIN_ORDER) {
    const exact = total * DOMAIN_META[d].weight;
    const capped = Math.min(Math.floor(exact), available.get(d) ?? 0);
    counts.set(d, capped);
    assigned += capped;
    remainders.push({ d, frac: exact - Math.floor(exact) });
  }

  remainders.sort((a, b) => b.frac - a.frac);
  const order = [...remainders.map((r) => r.d), ...DOMAIN_ORDER];

  let remaining = total - assigned;
  let progress = true;
  while (remaining > 0 && progress) {
    progress = false;
    for (const d of order) {
      if (remaining === 0) break;
      const have = counts.get(d)!;
      if (have < (available.get(d) ?? 0)) {
        counts.set(d, have + 1);
        remaining -= 1;
        progress = true;
      }
    }
  }

  return counts;
}

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** Spread domains apart so consecutive questions rarely share a domain. */
function interleaveByDomain<T extends { domain: Domain }>(items: T[]): T[] {
  const buckets = new Map<Domain, T[]>();
  for (const d of DOMAIN_ORDER) buckets.set(d, []);
  for (const item of items) buckets.get(item.domain)?.push(item);

  const out: T[] = [];
  let remaining = items.length;
  while (remaining > 0) {
    const order = [...DOMAIN_ORDER];
    shuffle(order);
    let moved = false;
    for (const d of order) {
      const bucket = buckets.get(d)!;
      if (bucket.length > 0) {
        out.push(bucket.shift()!);
        remaining -= 1;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return out;
}
