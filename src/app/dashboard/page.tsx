import Link from "next/link";
import { ArrowRight, Flame, HelpCircle, Target, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { readLearningContext } from "@/lib/session-server";
import { computeReadiness } from "@/lib/readiness";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { DisciplineBars } from "@/components/discipline-bars";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Progress Dashboard & Readiness Score",
  description:
    "Track your PMP readiness score, domain strengths and gaps, practice history, and flashcards across People, Process, and Business Environment.",
  robots: { index: false, follow: true } as const,
};

export default async function DashboardPage() {
  const { sessionId } = await readLearningContext();

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <HelpCircle className="mx-auto size-10 text-[var(--brand-teal)]" aria-hidden />
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Your readiness dashboard
          </h1>
          <p className="mt-3 text-muted-foreground">
            Answer a few questions and your dashboard will appear here — readiness
            score, domain strengths, gaps, and flashcards.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="cta">
              <Link href="/diagnostic">
                Take the free diagnostic <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/practice">Skip to adaptive practice</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const [readiness, attemptsCount, correctCount, streakQuery, dueFlashcards, recent, diagnostics] =
    await Promise.all([
      computeReadiness(sessionId),
      prisma.attempt.count({ where: { sessionId } }),
      prisma.attempt.count({ where: { sessionId, isCorrect: true } }),
      prisma.progress.findMany({
        where: { sessionId },
        select: { streak: true },
        orderBy: { updatedAt: "desc" },
        take: 20,
      }),
      prisma.progress.count({
        where: { sessionId, cardRating: { not: null }, dueAt: { lte: new Date() } },
      }),
      prisma.attempt.findMany({
        where: { sessionId },
        include: {
          question: { select: { stem: true, domain: true, correctKey: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.diagnosticResult.findMany({
        where: { sessionId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const totalAttempts = attemptsCount;
  const correct = correctCount;
  const accuracy = totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : null;
  const bestStreak = streakQuery.reduce((m, s) => Math.max(m, s.streak), 0);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your progress</h1>
          <p className="mt-2 text-muted-foreground">
            A clear picture of your knowledge strength — nothing more, nothing promised.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="cta">
            <Link href="/practice">Practice now</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/flashcards">Flashcards ({dueFlashcards})</Link>
          </Button>
        </div>
      </div>

      <Alert variant="info">
        <AlertIcon><Info className="size-4" /></AlertIcon>
        <AlertTitle>Read this first</AlertTitle>
        <AlertDescription>
          Your readiness score reflects how strong your knowledge is in the practice
          material. It is not a prediction of your actual exam result.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="items-center py-10">
          <ReadinessGauge value={readiness.score} label={readiness.label} size={200} />
          <div className="mt-4 px-6 text-center">
            <p className="text-sm text-muted-foreground">
              Based on {totalAttempts} answer{totalAttempts === 1 ? "" : "s"} across{" "}
              {readiness.domainScores.PEOPLE.answered +
                readiness.domainScores.PROCESS.answered +
                readiness.domainScores.BUSINESS_ENV.answered}{" "}
              touched questions.
            </p>
          </div>
        </Card>

        <div className="space-y-6">
          <DisciplineBars domainScores={readiness.domainScores} />

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Target className="size-4 text-[var(--brand-teal)]" /> Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tabular-nums">
                  {accuracy === null ? "—" : `${accuracy}%`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {correct} correct of {totalAttempts}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Flame className="size-4 text-amber-500" /> Best streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tabular-nums">{bestStreak}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  consecutive correct answers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="size-4 text-[var(--brand-teal)]" /> Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tabular-nums">{diagnostics.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  diagnostic + simulator results
                </p>
                {diagnostics.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {diagnostics.slice(0, 3).map((d) => (
                      <p key={d.id} className="text-xs text-muted-foreground">
                        {d.mode === "simulator" ? "Simulator" : "Diagnostic"} · {d.readiness}
                        /100 · {d.totalCorrect}/{d.total}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Where to focus next</CardTitle>
          </CardHeader>
          <CardContent>
            {readiness.needs.length > 0 ? (
              <ul className="space-y-2.5">
                {readiness.needs.map((n) => (
                  <li key={n} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--brand-teal)]" aria-hidden />
                    {n}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Balanced across all domains. Keep practicing to raise your score.
              </p>
            )}
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/practice">
                Continue adaptive practice <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent answers</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No answers yet. Take the diagnostic or start practice.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-start gap-2 text-sm">
                    <span
                      className={
                        r.isCorrect
                          ? "mt-0.5 text-xs font-bold text-success"
                          : "mt-0.5 text-xs font-bold text-destructive"
                      }
                    >
                      {r.isCorrect ? "✓" : "✗"}
                    </span>
                    <span className="flex-1 line-clamp-2 text-muted-foreground">
                      {r.question.stem}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}