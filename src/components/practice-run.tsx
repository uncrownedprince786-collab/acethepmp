"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DomainTag, CareerBadge } from "@/components/tags";
import { QuestionOption } from "@/components/question-option";
import { Alert, AlertDescription, AlertIcon } from "@/components/ui/alert";
import { apiFetch } from "@/lib/api";
import type { AnswerFeedback, QuestionData } from "@/lib/types";
import { Info } from "lucide-react";

type ProgressInfo = {
  seen: boolean;
  timesRight: number;
  timesWrong: number;
};

type NextQuestion = {
  ok: boolean;
  question: QuestionData | null;
  progress: ProgressInfo;
  reason?: string;
};

type FeedbackState = {
  feedback: AnswerFeedback;
  selected: "A" | "B" | "C" | "D";
};

function letterState(
  letter: "A" | "B" | "C" | "D",
  feedback: FeedbackState | null
): "idle" | "selected" | "correct" | "wrong" | "dim" {
  if (!feedback) return "idle";
  const { feedback: fb, selected } = feedback;
  if (letter === fb.correctKey) return "correct";
  if (letter === selected) return "wrong";
  return "dim";
}

export function PracticeRun() {
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState({ answered: 0, correct: 0, streak: 0 });
  const [linkError, setLinkError] = useState<string | null>(null);

  const loadNext = useCallback(async () => {
    setLoadingQ(true);
    setError(null);
    setFeedback(null);
    try {
      const data = await apiFetch<NextQuestion>("/api/practice/next");
      if (!data.question) {
        setQuestion(null);
        setError(data.reason ?? "No questions available yet.");
        return;
      }
      setQuestion(data.question);
      setProgress(data.progress);
      setLinkError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load a question.");
    } finally {
      setLoadingQ(false);
    }
  }, []);

  useEffect(() => {
    loadNext();
  }, [loadNext]);

  const submit = useCallback(
    async (key: "A" | "B" | "C" | "D") => {
      if (!question || submitting) return;
      setSubmitting(true);
      setLinkError(null);
      try {
        const fb = await apiFetch<AnswerFeedback>("/api/attempt", {
          method: "POST",
          body: JSON.stringify({ questionId: question.id, selectedKey: key, timeSeconds: null }),
        });
        setFeedback({ feedback: fb, selected: key });
        setStatus((s) => ({
          answered: s.answered + 1,
          correct: s.correct + (fb.isCorrect ? 1 : 0),
          streak: fb.isCorrect ? s.streak + 1 : 0,
        }));
      } catch (e) {
        setLinkError(e instanceof Error ? e.message : "Could not submit your answer.");
      } finally {
        setSubmitting(false);
      }
    },
    [question, submitting]
  );

  return (
    <div className="mx-auto max-w-3xl">
      {/* Session status */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Answered</p>
            <p className="font-bold tabular-nums">{status.answered}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Correct</p>
            <p className="font-bold tabular-nums">{status.correct}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="font-bold tabular-nums">{status.streak}</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">
            <BarChart3 className="size-4" /> Readiness score
          </Link>
        </Button>
      </div>

      {error && !question && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <p className="font-semibold">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            New questions are added regularly. Check back soon.
          </p>
        </div>
      )}

      {question && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="secondary">
              Adaptive · personalized to your gaps
            </Badge>
            <div className="flex items-center gap-2">
              <DomainTag domain={question.domain} />
              <CareerBadge envType={question.envType} />
            </div>
          </div>

          {progress?.seen && (
            <p className="mt-3 text-xs text-muted-foreground">
              Review card — seen {progress.timesRight + progress.timesWrong} time
              {progress.timesRight + progress.timesWrong === 1 ? "" : "s"} (
              {progress.timesRight} right, {progress.timesWrong} wrong)
            </p>
          )}

          <h2 className="mt-4 text-lg font-semibold leading-relaxed sm:text-xl">
            {question.stem}
          </h2>

          <div className="mt-6 space-y-3">
            {(["A", "B", "C", "D"] as const).map((letter) => (
              <QuestionOption
                key={letter}
                letter={letter}
                text={question.options[letter]}
                state={letterState(letter, feedback)}
                disabled={feedback !== null}
                onSelect={() => submit(letter)}
              />
            ))}
          </div>

          {submitting && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Checking your answer…
            </p>
          )}

          {linkError && <p className="mt-4 text-sm text-destructive">{linkError}</p>}

          {feedback && (
            <div className="mt-6 space-y-4">
              <Alert variant={feedback.feedback.isCorrect ? "success" : "warning"}>
                <AlertIcon>
                  {feedback.feedback.isCorrect ? "✓" : "✗"}
                </AlertIcon>
                <AlertDescription>
                  <strong>
                    {feedback.feedback.isCorrect ? "Correct! " : "Not quite. "}
                  </strong>
                  The correct answer is{" "}
                  {feedback.feedback.correctKey}. This question covers{" "}
                  {feedback.feedback.domainLabel} · task {feedback.feedback.task}.
                </AlertDescription>
              </Alert>
              <div className="rounded-xl border border-border bg-muted/40 p-5">
                <p className="text-sm font-semibold">Why this answer</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feedback.feedback.explanation}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={loadNext} disabled={loadingQ} variant="cta">
                  {loadingQ ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                  Next question
                </Button>
                <Button asChild variant="outline">
                  <Link href="/flashcards">
                    <RefreshCw className="size-4" /> Review as flashcard
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <Alert variant="info">
          <AlertIcon><Info className="size-4" /></AlertIcon>
          <AlertDescription>
            Practice adapts to your weakest domain and current level. Your readiness
            score reflects strength in this practice material — it is not an exam
            prediction.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}