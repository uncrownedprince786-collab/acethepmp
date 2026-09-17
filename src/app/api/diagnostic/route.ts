import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, withSessionCookie } from "@/lib/api-helpers";
import { DOMAIN_META, DOMAIN_ORDER } from "@/lib/eco";

export const dynamic = "force-dynamic";

const DIAGNOSTIC_SIZE = 10;

/**
 * Returns a balanced diagnostic question set sampled across all three ECO
 * domains in roughly the same proportions as the real exam.
 */
export async function GET(req: NextRequest) {
  const { sessionId, cookie } = await resolveSession();
  void sessionId;

  const countParam = Number(req.nextUrl.searchParams.get("count") ?? DIAGNOSTIC_SIZE);
  const count = Number.isFinite(countParam) ? Math.min(Math.max(countParam, 1), 20) : DIAGNOSTIC_SIZE;

  // Already-seen questions are prioritised last (a fresh diagnostic is most useful).
  const seen = await prisma.attempt.findMany({
    where: { sessionId },
    select: { questionId: true },
  });
  const seenSet = new Set(seen.map((s) => s.questionId));

  const questions = await prisma.question.findMany({ where: { status: "PUBLISHED" } });

  const fresh = questions.filter((q) => !seenSet.has(q.id));
  const pool = fresh.length >= count ? fresh : questions;

  // Domain-proportional sampling.
  const byDomain = new Map<string, typeof pool>();
  for (const q of pool) {
    const arr = byDomain.get(q.domain) ?? [];
    arr.push(q);
    byDomain.set(q.domain, arr);
  }

  const selected: typeof pool = [];
  for (const d of DOMAIN_ORDER) {
    const bucket = byDomain.get(d) ?? [];
    // Weighted target, rounding errors absorbed by PROCESS.
    const target =
      d === "PROCESS"
        ? count - selected.length
        : Math.max(1, Math.round(count * DOMAIN_META[d].weight));
    shuffle(bucket);
    selected.push(...bucket.slice(0, Math.max(0, Math.min(target, count - selected.length))));
  }

  shuffle(selected);

  const payload = selected.slice(0, count).map((q) => ({
    id: q.id,
    stem: q.stem,
    options: { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD },
    domain: q.domain,
    task: q.task,
    envType: q.envType,
    difficulty: q.difficulty,
    usedOnce: seenSet.has(q.id),
  }));

  if (payload.length < 1) {
    const res = NextResponse.json({
      ok: true,
      questions: [],
      reason: "No questions published yet. Come back soon!",
    });
    return withSessionCookie(res, cookie);
  }

  const res = NextResponse.json({
    ok: true,
    total: payload.length,
    questions: payload,
  });
  return withSessionCookie(res, cookie);
}

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}