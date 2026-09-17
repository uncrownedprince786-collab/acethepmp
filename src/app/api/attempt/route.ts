import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, resolveSession, withSessionCookie } from "@/lib/api-helpers";
import { DOMAIN_META } from "@/lib/eco";

export const dynamic = "force-dynamic";

const AttemptSchema = z.object({
  questionId: z.string().min(1),
  selectedKey: z.enum(["A", "B", "C", "D"]),
  timeSeconds: z.number().int().min(0).max(3600).nullable().optional(),
});

export async function POST(req: NextRequest) {
  const body = AttemptSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return jsonError("Invalid answer payload.");
  }

  const { sessionId, cookie } = await resolveSession();
  const { questionId, selectedKey, timeSeconds } = body.data;

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question || question.status !== "PUBLISHED") {
    return jsonError("Question not found.", 404);
  }

  const isCorrect = selectedKey === question.correctKey;

  const [attempt] = await Promise.all([
    prisma.attempt.create({
      data: {
        sessionId,
        questionId,
        selectedKey,
        isCorrect,
        timeSeconds: timeSeconds ?? null,
      },
    }),
  ]);

  // Update mastery + spaced-repetition state.
  const existing = await prisma.progress.findUnique({
    where: { sessionId_questionId: { sessionId, questionId } },
  });

  const progress = await prisma.progress.upsert({
    where: { sessionId_questionId: { sessionId, questionId } },
    create: {
      sessionId,
      questionId,
      timesSeen: 1,
      timesRight: isCorrect ? 1 : 0,
      timesWrong: isCorrect ? 0 : 1,
      streak: isCorrect ? 1 : 0,
      interval: isCorrect ? 1 : 0,
      lastResult: isCorrect,
      dueAt: isCorrect ? addDays(new Date(), 1) : new Date(),
    },
    update: {
      timesSeen: { increment: 1 },
      timesRight: isCorrect ? { increment: 1 } : undefined,
      timesWrong: isCorrect ? undefined : { increment: 1 },
      streak: isCorrect ? (existing?.streak ?? 0) + 1 : 0,
      interval: isCorrect ? Math.min(30, Math.max(1, (existing?.interval ?? 0) * 2 || 1)) : 0,
      lastResult: isCorrect,
      dueAt: isCorrect ? addDays(new Date(), Math.min(7, Math.max(1, existing?.interval ?? 0) + 1)) : new Date(),
    },
  });

  const res = NextResponse.json({
    ok: true,
    attemptId: attempt.id,
    isCorrect,
    correctKey: question.correctKey,
    explanation: question.explanation,
    domain: question.domain,
    domainLabel: DOMAIN_META[question.domain].label,
    task: question.task,
    envType: question.envType,
    progress: {
      timesSeen: progress.timesSeen,
      timesRight: progress.timesRight,
      timesWrong: progress.timesWrong,
      streak: progress.streak,
    },
  });

  return withSessionCookie(res, cookie);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}