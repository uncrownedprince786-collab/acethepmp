import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, resolveSession, withSessionCookie } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const ReviewSchema = z.object({
  questionId: z.string().min(1),
  // SM-2 style rated review for flashcards.
  rating: z.enum(["again", "hard", "good", "easy"]),
});

/** Records a flashcard self-review and schedules the next due date (SM-2 flavor). */
export async function POST(req: NextRequest) {
  const body = ReviewSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return jsonError("Invalid review payload.");
  }
  const { sessionId, cookie } = await resolveSession();
  const { questionId, rating } = body.data;

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) return jsonError("Question not found.", 404);

  const existing = await prisma.progress.findUnique({
    where: { sessionId_questionId: { sessionId, questionId } },
  });

  const interval = nextInterval(existing?.interval ?? 0, rating);
  const dueAt = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

  const progress = await prisma.progress.upsert({
    where: { sessionId_questionId: { sessionId, questionId } },
    create: {
      sessionId,
      questionId,
      cardRating: ratingToNumber(rating),
      interval,
      dueAt,
      timesSeen: 1,
    },
    update: {
      cardRating: ratingToNumber(rating),
      interval,
      dueAt,
      timesSeen: { increment: 1 },
    },
  });

  const dueCount = await prisma.progress.count({
    where: { sessionId, cardRating: { not: null }, dueAt: { lte: new Date() } },
  });

  const res = NextResponse.json({
    ok: true,
    interval,
    dueAt: dueAt.toISOString(),
    rating,
    dueCount,
    progress: {
      timesSeen: progress.timesSeen,
      cardRating: progress.cardRating,
    },
  });
  return withSessionCookie(res, cookie);
}

function nextInterval(current: number, rating: string): number {
  const cap = 90;
  switch (rating) {
    case "again":
      return 0;
    case "hard":
      return Math.min(cap, Math.max(1, Math.ceil((current || 1) * 1.2)));
    case "good":
      return Math.min(cap, current === 0 ? 1 : Math.ceil(current * 2));
    case "easy":
      return Math.min(cap, current <= 1 ? 2 : Math.ceil(current * 3));
    default:
      return 1;
  }
}

function ratingToNumber(r: string): number {
  switch (r) {
    case "again":
      return 1;
    case "hard":
      return 2;
    case "good":
      return 3;
    case "easy":
      return 4;
    default:
      return 3;
  }
}