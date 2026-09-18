"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coffee,
  Flag,
  Info,
  Loader2,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { QuestionOption } from "@/components/question-option";
import { DomainTag, CareerBadge } from "@/components/tags";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { apiFetch } from "@/lib/api";
import type { AnswerFeedback, AssessmentResult, QuestionData } from "@/lib/types";

type SimStart = {
  ok: boolean;
  total: number;
  examLength: number;
  durationMinutes: number;
  breakAfterQuestions: number[];
  breakMinutes: number;
  questions: QuestionData[];
};

type Phase = "intro" | "running" | "break" | "results";

function fmt(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function SimulatorRun() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [exam, setExam] = useState<SimStart | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Map<string, "A" | "B" | "C" | "D">>(new Map());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [, setFeedback] = useState<Map<string, AnswerFeedback>>(new Map());
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankTotal, setBankTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStart = useRef(Date.now());

  const totalQuestions = exam?.questions.length ?? 0;

  // Bank size for the intro screen. Loaded without starting an exam.
  useEffect(() => {
    let active = true;
    apiFetch<{ total: number }>("/api/simulator?meta=1")
      .then((data) => {
        if (active) setBankTotal(data.total);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<SimStart>("/api/simulator");
      if (!data.questions?.length) {
        setError("No questions published yet. Please check back soon.");
        return;
      }
      setExam(data);
      setAnswers(new Map());
      setFlagged(new Set());
      setFeedback(new Map());
      setCurrent(0);
      setTimeLeft(data.durationMinutes * 60);
      setExpired(false);
      setResult(null);
      setPhase("running");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the simulator.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "running") return;
    if (ticker.current) clearInterval(ticker.current);
    ticker.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setExpired(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (ticker.current) clearInterval(ticker.current);
      ticker.current = null;
    };
  }, [phase, current]);

  // Reset per-question timer whenever the visible question changes.
  useEffect(() => {
    questionStart.current = Date.now();
  }, [current]);

  const flashPending = useRef(false);

  const answer = useCallback(
    async (key: "A" | "B" | "C" | "D") => {
      if (phase !== "running" || !exam) return;
      const q = exam.questions[current];
      const next = new Map(answers);
      next.set(q.id, key);
      setAnswers(next);

      // Best-effort background save; don't block the UI.
      const elapsed = Math.max(1, Math.round((Date.now() - questionStart.current) / 1000));
      questionStart.current = Date.now();
      fetch("/api/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          questionId: q.id,
          selectedKey: key,
          timeSeconds: elapsed,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.ok) {
            setFeedback((m) => {
              const copy = new Map(m);
              copy.set(q.id, data as AnswerFeedback);
              return copy;
            });
          }
        })
        .catch(() => undefined);

      // Break boundary check
      const after = current + 1;
      const breakPoints = exam.breakAfterQuestions ?? [];
      if (
        (breakPoints.includes(after) || (expired && after >= 60)) &&
        after < totalQuestions &&
        !flashPending.current
      ) {
        flashPending.current = true;
        setPhase("break");
      }
    },
    [answers, current, exam, expired, phase, totalQuestions]
  );

  const resume = useCallback(() => {
    flashPending.current = false;
    setPhase("running");
  }, []);

  const submit = useCallback(async () => {
    if (!exam) return;
    setSubmitting(true);
    setError(null);
    const results = Array.from(answers.entries()).map(([questionId, selectedKey]) => ({
      questionId,
      selectedKey,
      timeSeconds: null,
    }));
    try {
      const res = await apiFetch<AssessmentResult>("/api/assessments", {
        method: "POST",
        body: JSON.stringify({ mode: "simulator", results, total: exam.questions.length }),
      });
      setResult(res);
      setPhase("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit the exam.");
    } finally {
      setSubmitting(false);
    }
  }, [answers, exam]);

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-teal)]">
            2026 exam-authentic simulator
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Full-length PMP exam simulation
          </h1>
          <p className="mt-3 text-muted-foreground">
            Same format as the real test: questions across People, Process, and
            Business Environment, a timed session with breaks, and flag-and-review.
            Any answers you give are saved to your practice record.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-semibold">180 questions</p>
              <p className="text-xs text-muted-foreground">
                current bank: {bankTotal !== null ? `${bankTotal} questions` : "checking…"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-semibold">240 minutes</p>
              <p className="text-xs text-muted-foreground">timer stops during breaks</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-semibold">2 × 10-min breaks</p>
              <p className="text-xs text-muted-foreground">after question 60 and 120</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {[
              "Flag questions to revisit before you submit",
              "Change an answer any time before finishing",
              "Unanswered questions are counted as incorrect",
              "You can leave the exam whenever you like",
            ].map((s) => (
              <li key={s} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--brand-teal)]" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          <div className="mt-6">
            <Button onClick={start} variant="cta" size="lg" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Preparing…" : "Begin the simulation"}
            </Button>
          </div>
          <div className="mt-5">
            <Alert variant="info">
              <AlertIcon><Info className="size-4" /></AlertIcon>
              <AlertDescription>
                This is a practice simulation only. Real exam questions and conditions
                are controlled by PMI. A practice score is not a guarantee of exam
                success.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "break" && exam) {
    const after = current + 1;
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <Coffee className="mx-auto size-10 text-[var(--brand-teal)]" aria-hidden />
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Time for a break</h2>
          <p className="mt-2 text-muted-foreground">
            You finished question {after}. In the real exam you may take up to{" "}
            {exam.breakMinutes} minutes now — the timer is paused and not counted
            against you.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={resume} variant="cta">
              Continue the exam <ArrowRight className="size-4" />
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Remaining time: {fmt(timeLeft)} — paused during your break.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "results" && result) {
    const unanswered = totalQuestions - answers.size;
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="text-center">
            <ReadinessGauge value={result.pct} label="Sim score" size={180} />
            <p className="mt-2 text-sm text-muted-foreground">
              {result.totalCorrect} of {result.total} correct ({result.pct}%)
              {unanswered > 0 ? ` · ${unanswered} not answered` : ""}
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
                  <p className="text-xs text-muted-foreground">domain accuracy</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8">
            <Alert variant="info">
              <AlertIcon><Info className="size-4" /></AlertIcon>
              <AlertDescription>
                This is a practice simulation only. Real exam conditions and questions
                are controlled by PMI. Use this score as a signal of where to focus, not
                as a prediction of your exam result.
              </AlertDescription>
            </Alert>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/practice">Practice your weakest areas</Link>
            </Button>
            <Button variant="outline" onClick={start}>
              Run another simulation
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!exam || phase === "running" && exam.questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center text-muted-foreground">
        <Loader2 className="mx-auto size-6 animate-spin" /> Loading exam…
      </div>
    );
  }

  const q = exam!.questions[current];
  const answeredCount = answers.size;
  const hasPrev = current > 0;
  const hasNext = current < totalQuestions - 1;
  const progressPct = ((current + 1) / totalQuestions) * 100;
  const isFlagged = flagged.has(q.id);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Control bar */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-border/70 bg-card/90 px-4 py-2.5 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Question {current + 1} <span className="mx-1 text-muted-foreground/50">·</span>
              {answeredCount} answered <span className="mx-1 text-muted-foreground/50">·</span>{" "}
              {exam!.breakAfterQuestions.includes(current + 1) ? (
                <span className="font-semibold text-[var(--brand-teal)]">break after this</span>
              ) : (
                <span>next break: Q{exam!.breakAfterQuestions.find((b) => b > current + 1) ?? "—"}</span>
              )}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-bold tabular-nums ${
              timeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"
            }`}
            aria-live="polite"
          >
            <Timer className="size-4" aria-hidden />
            {fmt(timeLeft)}
          </div>
        </div>
        <Progress className="mt-2" value={progressPct} aria-hidden />
      </div>

      {expired && (
        <Alert variant="warning" className="mt-4">
          <AlertIcon><AlertTriangle className="size-4" /></AlertIcon>
          <AlertTitle>Time is up</AlertTitle>
          <AlertDescription>
            The exam clock reached zero. Answer remaining questions or submit what you
            have — unanswered questions count as incorrect.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Question */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <DomainTag domain={q.domain} />
              <CareerBadge envType={q.envType} />
            </div>
            <Button
              variant="outline"
              size="sm"
              aria-pressed={isFlagged}
              onClick={() =>
                setFlagged((f) => {
                  const copy = new Set(f);
                  if (copy.has(q.id)) copy.delete(q.id);
                  else copy.add(q.id);
                  return copy;
                })
              }
            >
              <Flag className={`size-4 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
              {isFlagged ? "Flagged" : "Flag for review"}
            </Button>
          </div>
          <h2 className="mt-5 text-lg font-semibold leading-relaxed sm:text-xl">{q.stem}</h2>
          <div className="mt-6 space-y-3">
            {(["A", "B", "C", "D"] as const).map((letter) => (
              <QuestionOption
                key={letter}
                letter={letter}
                text={q.options[letter]}
                state={answers.get(q.id) === letter ? "selected" : "idle"}
                onSelect={() => answer(letter)}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" disabled={!hasPrev} onClick={() => setCurrent((c) => c - 1)}>
              <ArrowLeft className="size-4" /> Previous
            </Button>
            {hasNext ? (
              <Button variant="outline" size="sm" onClick={() => setCurrent((c) => c + 1)}>
                Next <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button variant="cta" size="sm" onClick={submit} disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                Submit exam
              </Button>
            )}
          </div>
        </div>

        {/* Palette */}
        <aside className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold">Question palette</p>
          <div className="mt-3 grid grid-cols-8 gap-1.5 lg:grid-cols-10">
            {exam!.questions.map((qq, i) => {
              const isA = answers.has(qq.id);
              const isF = flagged.has(qq.id);
              return (
                <button
                  key={qq.id}
                  type="button"
                  aria-label={`Go to question ${i + 1}${isA ? ", answered" : ""}${isF ? ", flagged" : ""}`}
                  onClick={() => setCurrent(i)}
                  className={`relative flex size-7 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                    i === current
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                      : isA
                        ? "bg-[var(--brand-teal)]/15 text-[var(--brand-teal)]"
                        : "bg-muted text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {i + 1}
                  {isF && (
                    <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-amber-500" aria-hidden />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <p className="flex items-center gap-2"><span className="size-3 rounded bg-[var(--brand-teal)]/15" /> answered</p>
            <p className="flex items-center gap-2"><span className="size-3 rounded bg-primary" /> current</p>
            <p className="flex items-center gap-2"><span className="size-2 rounded-full bg-amber-500" /> flagged</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={() => {
              const unanswered = exam!.questions.filter((qq) => !answers.has(qq.id));
              if (unanswered.length > 0) setCurrent(exam!.questions.indexOf(unanswered[0]));
            }}
          >
            Jump to first unanswered
          </Button>
          <Button variant="cta" size="sm" className="mt-2 w-full" onClick={submit} disabled={submitting}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            Submit exam
          </Button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {totalQuestions - answeredCount} unanswered (count as incorrect)
          </p>
        </aside>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  );
}