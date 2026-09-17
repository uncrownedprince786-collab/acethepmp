import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, withSessionCookie } from "@/lib/api-helpers";
import { EXAM_CONFIG, DOMAIN_ORDER } from "@/lib/eco";

export const dynamic = "force-dynamic";

/**
 * Full-length exam simulator set. Returns the current published question bank
 * (up to the 180-question exam length) ordered to approximate real-exam domain
 * proportions. When the bank grows to 180+, this becomes a true full mock.
 */
export async function GET() {
  const { sessionId, cookie } = await resolveSession();
  void sessionId;

  const questions = await prisma.question.findMany({ where: { status: "PUBLISHED" } });

  const buckets = new Map<string, typeof questions>();
  for (const q of questions) {
    const arr = buckets.get(q.domain) ?? [];
    arr.push(q);
    buckets.set(q.domain, arr);
  }

  const ordered: typeof questions = [];
  for (const d of DOMAIN_ORDER) {
    const bucket = [...(buckets.get(d) ?? [])];
    shuffle(bucket);
    ordered.push(...bucket);
  }
  // Interleave a little so consecutive questions are not all one domain.
  const interleaved = interleaveByDomain(buckets);

  const payload = (interleaved.length > 0 ? interleaved : ordered).map((q) => ({
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
    total: payload.length,
    examLength: EXAM_CONFIG.totalQuestions,
    durationMinutes: EXAM_CONFIG.durationMinutes,
    breakAfterQuestions: EXAM_CONFIG.breakAfterQuestions,
    breakMinutes: EXAM_CONFIG.breakMinutes,
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

function interleaveByDomain<T extends { id: string; domain: string }>(
  buckets: Map<string, T[]>
): T[] {
  const out: T[] = [];
  let remaining = 0;
  for (const arr of buckets.values()) remaining += arr.length;
  let guard = 0;
  while (remaining > 0 && guard < 2000) {
    guard += 1;
    let moved = false;
    for (const d of DOMAIN_ORDER) {
      const bucket = buckets.get(d);
      if (bucket && bucket.length > 0) {
        out.push(bucket.shift()!);
        remaining -= 1;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return out;
}