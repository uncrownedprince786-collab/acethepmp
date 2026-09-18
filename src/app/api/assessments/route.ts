import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, resolveSession, withSessionCookie } from "@/lib/api-helpers";
import { buildReadiness, type DomainStat } from "@/lib/readiness";
import type { Domain } from "@prisma/client";

export const dynamic = "force-dynamic";

const ResultRow = z.object({
  questionId: z.string().min(1),
  selectedKey: z.enum(["A", "B", "C", "D"]),
  timeSeconds: z.number().int().min(0).max(3600).nullable().optional(),
});

const CompleteSchema = z.object({
  mode: z.enum(["diagnostic", "simulator"]).default("diagnostic"),
  results: z.array(ResultRow).max(200),
  // Simulator only: total questions in the exam. Unanswered questions are
  // counted as incorrect, so the score is correct / total, not correct / answered.
  total: z.number().int().min(0).max(500).optional(),
});

/**
 * Finishes a diagnostic or simulator run: records any answers not already
 * submitted, computes domain scores + a readiness estimate, and stores the
 * result on the learner session.
 */
export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = CompleteSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError("Invalid results payload.");
  }

  const { sessionId, cookie } = await resolveSession();
  const { mode, results } = parsed.data;
  const denominator =
    mode === "simulator" && parsed.data.total !== undefined
      ? Math.max(parsed.data.total, results.length)
      : results.length;

  const ids = results.map((r) => r.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: ids } },
    select: { id: true, correctKey: true, domain: true },
  });
  const qMap = new Map(questions.map((q) => [q.id, q]));

  const byDomain = new Map<Domain, DomainStat>();
  let totalCorrect = 0;

  for (const row of results) {
    const q = qMap.get(row.questionId);
    if (!q) continue;
    const correct = row.selectedKey === q.correctKey;
    if (correct) totalCorrect += 1;
    const s = byDomain.get(q.domain) ?? { right: 0, wrong: 0 };
    if (correct) s.right += 1;
    else s.wrong += 1;
    byDomain.set(q.domain, s);
  }

  const breakdown = buildReadiness(byDomain, results.length, totalCorrect);

  const domainScores: Record<Domain, { accuracy: number | null }> = {} as never;
  for (const [d, s] of byDomain) {
    domainScores[d] = { accuracy: s.right / (s.right + s.wrong) };
  }

  await prisma.diagnosticResult.create({
    data: {
      sessionId,
      mode,
      domainScores: domainScores as object,
      totalCorrect,
      total: denominator,
      readiness: breakdown.score,
    },
  });

  const res = NextResponse.json({
    ok: true,
    mode,
    readiness: breakdown.score,
    label: breakdown.label,
    totalCorrect,
    total: denominator,
    pct: denominator > 0 ? Math.round((totalCorrect / denominator) * 100) : 0,
    domainScores,
    needs: breakdown.needs,
  });
  return withSessionCookie(res, cookie);
}