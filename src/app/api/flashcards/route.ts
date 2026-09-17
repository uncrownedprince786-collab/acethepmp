import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, withSessionCookie } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * Returns flashcards that are due for review (dueAt reached), including
 * questions encountered in practice that have not yet been self-rated.
 */
export async function GET() {
  const { sessionId, cookie } = await resolveSession();

  const due = await prisma.progress.findMany({
    where: { sessionId, dueAt: { lte: new Date() } },
    include: {
      question: {
        select: {
          id: true,
          stem: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          correctKey: true,
          explanation: true,
          domain: true,
          task: true,
          envType: true,
          difficulty: true,
        },
      },
    },
    orderBy: { dueAt: "asc" },
    take: 50,
  });

  const upcomingCount = await prisma.progress.count({
    where: { sessionId, dueAt: { gt: new Date() } },
  });

  const cards = due.map((p) => ({
    questionId: p.questionId,
    interval: p.interval,
    cardRating: p.cardRating,
    timesSeen: p.timesSeen,
    dueAt: p.dueAt.toISOString(),
    question: {
      stem: p.question.stem,
      options: {
        A: p.question.optionA,
        B: p.question.optionB,
        C: p.question.optionC,
        D: p.question.optionD,
      },
      correctKey: p.question.correctKey,
      explanation: p.question.explanation,
      domain: p.question.domain,
      task: p.question.task,
      envType: p.question.envType,
      difficulty: p.question.difficulty,
    },
  }));

  const res = NextResponse.json({
    ok: true,
    total: cards.length,
    upcomingCount,
    cards,
  });
  return withSessionCookie(res, cookie);
}