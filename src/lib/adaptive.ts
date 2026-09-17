import type { Domain, Difficulty, EnvType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DOMAIN_META } from "@/lib/eco";

const DIFFICULTY_ORDER: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const DIFFICULTY_POINTS: Record<Difficulty, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };

/**
 * Simple, explainable adaptive picker.
 *
 * Strategy:
 *  1. Find the learner's weakest domain (lowest recent accuracy with enough
 *     samples; falls back to ECO weighting when there is little history).
 *  2. Prefer unseen questions in that domain.
 *  3. Set difficulty from the learner's recent accuracy on that domain —
 *     roughly 65-85% accuracy is the "learning zone".
 *  4. Randomize within the candidate bucket so repetition is reduced.
 */
export async function pickQuestion(
  sessionId: string,
  excludeIds: string[] = []
): Promise<{ question: { id: string; stem: string; options: Record<string, string>; domain: Domain; task: number; envType: EnvType; difficulty: Difficulty }; progress: { seen: boolean; timesRight: number; timesWrong: number } } | null> {
  const [attempts, seen] = await Promise.all([
    prisma.attempt.findMany({
      where: { sessionId },
      select: {
        isCorrect: true,
        question: { select: { domain: true, difficulty: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 80,
    }),
    prisma.progress.findMany({
      where: { sessionId },
      select: { questionId: true, timesRight: true, timesWrong: true },
    }),
  ]);

  const seenMap = new Map(seen.map((p) => [p.questionId, p]));
  const excluded = new Set(excludeIds);

  // --- Weakest domain -----------------------------------------------------
  const domainStats = new Map<Domain, { right: number; wrong: number }>();
  for (const a of attempts) {
    const s = domainStats.get(a.question.domain) ?? { right: 0, wrong: 0 };
    if (a.isCorrect) s.right += 1;
    else s.wrong += 1;
    domainStats.set(a.question.domain, s);
  }

  const domains: Domain[] = ["PEOPLE", "PROCESS", "BUSINESS_ENV"];
  let targetDomain: Domain;

  const answeredDomains = domains.filter((d) => {
    const s = domainStats.get(d);
    return s && s.right + s.wrong >= 3;
  });

  if (answeredDomains.length > 0) {
    // Weakest = lowest accuracy among domains with enough data.
    targetDomain = answeredDomains.sort((a, b) => {
      const sa = domainStats.get(a)!;
      const sb = domainStats.get(b)!;
      return sa.right / (sa.right + sa.wrong) - sb.right / (sb.right + sb.wrong);
    })[0];
    // Weighted toward the biggest domain if everything is strong.
    if (targetDomain !== "PROCESS" && Math.random() < 0.2) targetDomain = "PROCESS";
  } else {
    // No history: sample proportionally to ECO weight.
    const peopleCutoff = DOMAIN_META.PEOPLE.weight;
    const processCutoff = peopleCutoff + DOMAIN_META.PROCESS.weight;
    const roll = Math.random();
    targetDomain =
      roll < peopleCutoff ? "PEOPLE" : roll < processCutoff ? "PROCESS" : "BUSINESS_ENV";
  }

  // --- Difficulty from accuracy on the target domain -----------------------
  const ds = domainStats.get(targetDomain);
  const accuracy = ds && ds.right + ds.wrong > 0 ? ds.right / (ds.right + ds.wrong) : null;
  const currentIndex = DIFFICULTY_ORDER.indexOf(difficultyFromAccuracy(accuracy));

  // --- Query a candidate ----------------------------------------------------
  const candidates = await prisma.question.findMany({
    where: {
      status: "PUBLISHED",
      domain: targetDomain,
      ...(excluded.size > 0
        ? { NOT: { id: { in: Array.from(excluded).slice(0, 200) } } }
        : {}),
    },
    orderBy: { id: "asc" },
  });

  if (candidates.length === 0) {
    const all = await prisma.question.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { id: "asc" },
    });
    if (all.length === 0) return null;
    return toPayload(pickBest(all, currentIndex, seenMap), seenMap);
  }

  return toPayload(pickBest(candidates, currentIndex, seenMap), seenMap);
}

function difficultyFromAccuracy(accuracy: number | null): Difficulty {
  if (accuracy === null) return "MEDIUM";
  if (accuracy < 0.6) return "EASY";
  if (accuracy < 0.85) return "MEDIUM";
  return "HARD";
}

/** Among candidates, prefer unseen, then closest difficulty, then random. */
function pickBest<T extends { id: string; difficulty: Difficulty }>(
  candidates: T[],
  desiredIndex: number,
  seenMap: Map<string, { questionId: string }>
): T {
  const unseen = candidates.filter((c) => !seenMap.has(c.id));
  const pool = unseen.length > 0 ? unseen : candidates;

  // Score: penalize distance from desired difficulty, plus small random jitter.
  const scored = pool.map((c) => ({
    c,
    score:
      Math.abs(DIFFICULTY_ORDER.indexOf(c.difficulty) - desiredIndex) * 10 +
      Math.random() * 6,
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored[0].c;
}

type QuestionLike = {
  id: string;
  stem: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  domain: Domain;
  task: number;
  envType: EnvType;
  difficulty: Difficulty;
};

function toPayload(q: QuestionLike, seenMap: Map<string, { timesRight: number; timesWrong: number }>) {
  return {
    question: {
      id: q.id,
      stem: q.stem,
      options: { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD },
      domain: q.domain,
      task: q.task,
      envType: q.envType,
      difficulty: q.difficulty,
    },
    progress: {
      seen: seenMap.has(q.id),
      timesRight: seenMap.get(q.id)?.timesRight ?? 0,
      timesWrong: seenMap.get(q.id)?.timesWrong ?? 0,
    },
  };
}

export { DIFFICULTY_POINTS, DIFFICULTY_ORDER };