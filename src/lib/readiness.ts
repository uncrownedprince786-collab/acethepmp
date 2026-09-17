import type { Domain } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DOMAIN_META, DOMAIN_ORDER } from "@/lib/eco";

export type DomainStat = { right: number; wrong: number };

export type ReadinessBreakdown = {
  score: number;
  label: string;
  domainScores: Record<Domain, { accuracy: number | null; answered: number; weight: number }>;
  totalAttempts: number;
  totalCorrect: number;
  coverage: number; // sum of ECO weights of domains actually practiced, 0..1
  needs: string[];
};

/** How many recent attempts count toward readiness. */
const RECENT = 120;

/**
 * Readiness score: a measure of knowledge strength in the practice material.
 * It is NOT a prediction of exam success. Higher confidence comes from more
 * practice across all three ECO domains.
 */
export async function computeReadiness(sessionId: string): Promise<ReadinessBreakdown> {
  const attempts = await prisma.attempt.findMany({
    where: { sessionId },
    include: { question: { select: { domain: true } } },
    orderBy: { createdAt: "desc" },
    take: RECENT,
  });

  const byDomain = new Map<Domain, DomainStat>();
  let totalCorrect = 0;
  for (const a of attempts) {
    const s = byDomain.get(a.question.domain) ?? { right: 0, wrong: 0 };
    if (a.isCorrect) {
      s.right += 1;
      totalCorrect += 1;
    } else {
      s.wrong += 1;
    }
    byDomain.set(a.question.domain, s);
  }

  return buildReadiness(byDomain, attempts.length, totalCorrect);
}

/** Pure builder used by API routes (including the diagnostic). */
export function buildReadiness(
  byDomain: Map<Domain, DomainStat> | Record<Domain, DomainStat>,
  totalAttempts: number,
  totalCorrect: number
): ReadinessBreakdown {
  const map =
    byDomain instanceof Map ? byDomain : toMap(byDomain);

  const domainScores = {} as ReadinessBreakdown["domainScores"];
  let weightedSum = 0;
  let answeredWeight = 0;

  for (const d of DOMAIN_ORDER) {
    const s = map.get(d);
    const answered = s ? s.right + s.wrong : 0;
    const accuracy = answered > 0 ? s!.right / answered : null;
    domainScores[d] = {
      accuracy,
      answered,
      weight: DOMAIN_META[d].weight,
    };
    if (accuracy !== null) {
      weightedSum += DOMAIN_META[d].weight * accuracy;
      answeredWeight += DOMAIN_META[d].weight;
    }
  }

  const accuracyScore = answeredWeight > 0 ? (weightedSum / answeredWeight) * 100 : 0;
  const coverage = answeredWeight;
  const confidence = 0.6 + 0.4 * Math.min(1, totalAttempts / 30);
  const score = clamp(Math.round(accuracyScore * confidence));

  return {
    score,
    label: readinessLabel(score),
    domainScores,
    totalAttempts,
    totalCorrect,
    coverage,
    needs: needsList(domainScores, totalAttempts),
  };
}

function toMap(r: Record<Domain, DomainStat>): Map<Domain, DomainStat> {
  const m = new Map<Domain, DomainStat>();
  for (const d of DOMAIN_ORDER) m.set(d, r[d]);
  return m;
}

function needsList(
  ds: ReadinessBreakdown["domainScores"],
  totalAttempts: number
): string[] {
  const out: string[] = [];
  if (totalAttempts < 10) {
    out.push("Answer at least 10 questions for a meaningful readiness score.");
  }
  for (const d of DOMAIN_ORDER) {
    const acc = ds[d].accuracy;
    if (acc === null) {
      out.push(`You have not practiced ${DOMAIN_META[d].label.toLowerCase()} yet — try a few questions in this domain.`);
    } else if (acc < 0.65) {
      out.push(`${DOMAIN_META[d].label} accuracy is ${Math.round(acc * 100)}% — this is your best area to improve.`);
    }
  }
  return out;
}

export function readinessLabel(score: number): string {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Developing";
  if (score >= 50) return "Building";
  if (score >= 1) return "Getting started";
  return "No data yet";
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}