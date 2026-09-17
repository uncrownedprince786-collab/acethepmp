import { NextResponse } from "next/server";
import { pickQuestion } from "@/lib/adaptive";
import { resolveSession, withSessionCookie } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Next adaptive practice question for this learner session. */
export async function GET() {
  const { sessionId, cookie } = await resolveSession();

  const answeredIds = await prisma.attempt
    .findMany({
      where: { sessionId },
      select: { questionId: true },
      orderBy: { createdAt: "desc" },
      take: 300,
    })
    .then((rows) => rows.map((r) => r.questionId));

  const picked = await pickQuestion(sessionId, answeredIds);
  if (!picked) {
    const res = NextResponse.json({
      ok: true,
      question: null,
      reason: "No published questions available yet.",
    });
    return withSessionCookie(res, cookie);
  }

  const res = NextResponse.json({ ok: true, ...picked });
  return withSessionCookie(res, cookie);
}