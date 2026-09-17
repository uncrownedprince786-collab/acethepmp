"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DomainTag, CareerBadge } from "@/components/tags";
import { QuestionOption } from "@/components/question-option";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle, AlertIcon } from "@/components/ui/alert";
import { apiFetch } from "@/lib/api";
import type {
  AnswerFeedback,
  AssessmentResult,
  QuestionData,
} from "@/lib/types";

const DIAGNOSTIC_COUNT = 10;

type AnswerRecord = {
  questionId: string;
  selectedKey: "A" | "B" | "C" | "D";
  timeSeconds: number;
  feedback: AnswerFeedback;
};

type Phase = "intro" | "running" | "results";

export function DiagnosticRun() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionStart = useRef(Date.now());

  const answersRef = useRef<AnswerRecord[]>([]);
  answersRef.current = answers;
  const questionsRef = useRef<QuestionData[]>([]);
  questionsRef.current = questions;

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ ok: boolean; questions: QuestionData[] }>(
        `/api/diagnostic?count=${DIAGNOSTIC_COUNT}`
      );
      if (!data.questions || data.questions.length === 0) {
        setError(
          "The question bank is still being prepared. Please check back soon."
        );
        return;
      }
      const qs = data.questions.slice(0, DIAGNOSTIC_COUNT);
      setQuestions(qs);
      setIndex(0);
      setAnswers([]);
      setResult(null);
      setSelected(null);
      questionStart.current = Date.now();
      setPhase("running");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the diagnostic.");
    } finally {
      setLoading(false);
    }
  }, []);

  const finish = useCallback(async (finalAnswers: AnswerRecord[]) => {
    setLoading(true);
    try {
      const res = await apiFetch<AssessmentResult>("/api/assessments", {
        method: "POST",
        body: JSON.stringify({
          mode: "diagnostic",
          results: finalAnswers.map((a) => ({
            questionId: a.questionId,
            selectedKey: a.selectedKey,
            timeSeconds: a.timeSeconds,
          })),
        }),
      });
      setResult(res);
      setPhase("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not finalize your diagnostic.");
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (key: "A" | "B" | "C" | "D") => {
      const q = questionsRef.current[indexRef.current];
      if (!q || phaseRef.current !== "running" || selectedRef.current) return;

      setSelected(key);
      const timeSeconds = Math.max(
        1,
        Math.round((Date.now() - questionStart.current) / 1000)
      );
      questionStart.current = Date.now();

      let feedback: AnswerFeedback;
      try {
        feedback = await apiFetch<AnswerFeedback>("/api/attempt", {
          method: "POST",
          body: JSON.stringify({ questionId: q.id, selectedKey: key, timeSeconds }),
        });
      } catch {
        feedback = {
          ok: false,
          attemptId: "",
          isCorrect: false,
          correctKey: key,
          explanation:
            "We couldn't record this answer right now. Continue — your progress is still being tracked.",
          domain: q.domain,
          domainLabel: q.domain,
          task: q.task,
          envType: q.envType,
          progress: { timesSeen: 0, timesRight: 0, timesWrong: 0, streak: 0 },
        };
      }

      const record: AnswerRecord = { questionId: q.id, selectedKey: key, timeSeconds, feedback };
      const nextAnswers = [...answersRef.current, record];
      answersRef.current = nextAnswers;
      setAnswers(nextAnswers);

      if (indexRef.current + 1 < questionsRef.current.length) {
        setIndex(indexRef.current + 1);
        setSelected(null);
      } else {
        setSelected(null);
        await finish(nextAnswers);
      }
    },
    [finish]
  );

  const indexRef = useRef(0);
  indexRef.current = index;
  const selectedRef = useRef<unknown>(null);
  selectedRef.current = selected;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (phase === "running") questionStart.current = Date.now();
  }, [phase]);

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-teal)]">
            Free diagnostic
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Where does your PMP knowledge stand?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Answer {DIAGNOSTIC_COUNT} original questions sampled across People, Process,
            and Business Environment. You get a domain-by-domain breakdown and a
            starting readiness score. No account needed.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: "🧭", title: `${DIAGNOSTIC_COUNT} questions`, sub: "all three domains" },
              { icon: "⏱️", title: "~15 minutes", sub: "at your own pace" },
              { icon: "📊", title: "Readiness score", sub: "0–100 breakdown" },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xl" aria-hidden>{c.icon}</p>
                <p className="mt-1 text-sm font-semibold">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={start} variant="cta" size="lg" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Preparing…" : "Start the diagnostic"}
              {!loading && <ArrowRight className="size-4" />}
            </Button>
          </div>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          <div className="mt-5">
            <Alert variant="info">
              <AlertIcon><Info className="size-4" /></AlertIcon>
              <AlertTitle>Honest framing</AlertTitle>
              <AlertDescription>
                Your readiness score reflects your performance in this practice material.
                It is not a prediction of your exam result.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results" && result) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="text-center">
            <ReadinessGauge value={result.readiness} label={result.label} size={180} />
            <p className="mt-2 text-sm text-muted-foreground">
              You answered {result.totalCorrect} of {result.total} correctly ({result.pct}%)
              across all three domains.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {(["PEOPLE", "PROCESS", "BUSINESS_ENV"] as const).map((d) => {
              const s = result.domainScores[d];
              const pct = s && s.accuracy !== null ? Math.round(s.accuracy * 100) : null;
              return (
                <div key={d} className="rounded-xl border border-border bg-muted/40 p-4">
                  <DomainTag domain={d} />
                  <p className="mt-2 text-2xl font-bold">{pct === null ? "—" : `${pct}%`}</p>
                  <p className="text-xs text-muted-foreground">
                    {pct === null ? "no questions answered" : "domain accuracy"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-y-3">
            {answers.map((a, i) => {
              const q = questions.find((x) => x.id === a.questionId);
              if (!q) return null;
              return (
                <details key={a.questionId} className="rounded-xl border border-border bg-card p-4">
                  <summary className="flex cursor-pointer list-none items-start gap-3 text-sm font-semibold">
                    <span className={a.feedback.isCorrect ? "text-success" : "text-destructive"}>
                      {a.feedback.isCorrect ? "✓" : "✗"}
                    </span>
                    <span>{i + 1}. {q.stem}</span>
                  </summary>
                  <div className="mt-3 space-y-3 pl-7">
                    <p className="text-sm">
                      <strong>Correct answer: {a.feedback.correctKey}.</strong>{" "}
                      {q.options[a.feedback.correctKey as keyof typeof q.options]}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{a.feedback.explanation}</p>
                  </div>
                </details>
              );
            })}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button asChild>
              <Link href="/practice">
                Continue with adaptive practice <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" onClick={start}>
              <RotateCcw className="size-4" /> Retake diagnostic
            </Button>
          </div>
          <div className="mt-4">
            <Alert variant="info">
              <AlertIcon><Info className="size-4" /></AlertIcon>
              <AlertDescription>
                Your readiness score is a measure of knowledge strength in this practice
                material — it is not a prediction of the real exam.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[index];
  if (!q) {
    return (
      <div className="mx-auto max-w-2xl text-center text-muted-foreground">
        Loading your first question…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-muted-foreground">
            Question {index + 1} of {questions.length}
          </p>
          <div className="flex items-center gap-2">
            <DomainTag domain={q.domain} />
            <CareerBadge envType={q.envType} />
          </div>
        </div>
        <Progress className="mt-3" value={(answers.length / questions.length) * 100} aria-hidden />
        <h2 className="mt-6 text-lg font-semibold leading-relaxed sm:text-xl">{q.stem}</h2>
        <div className="mt-6 space-y-3">
          {(["A", "B", "C", "D"] as const).map((letter) => (
            <QuestionOption
              key={letter}
              letter={letter}
              text={q.options[letter]}
              state={selected === letter ? "selected" : "idle"}
              disabled={selected !== null}
              onSelect={() => submitAnswer(letter)}
            />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Choose the best answer — you can move to the next question right away.
        </p>
      </div>
    </div>
  );
}