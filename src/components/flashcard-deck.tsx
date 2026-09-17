"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DomainTag, CareerBadge } from "@/components/tags";
import { apiFetch } from "@/lib/api";

type FCard = {
  questionId: string;
  interval: number;
  cardRating: number | null;
  timesSeen: number;
  dueAt: string;
  question: {
    stem: string;
    options: { A: string; B: string; C: string; D: string };
    correctKey: "A" | "B" | "C" | "D";
    explanation: string;
    domain: "PEOPLE" | "PROCESS" | "BUSINESS_ENV";
    task: number;
    envType: "PREDICTIVE" | "AGILE" | "HYBRID";
    difficulty: string;
  };
};

type DueResponse = {
  ok: boolean;
  total: number;
  upcomingCount: number;
  cards: FCard[];
};

const RATINGS = [
  { key: "again", label: "Again", hint: "forgot it", cls: "text-destructive" },
  { key: "hard", label: "Hard", hint: "tough", cls: "text-amber-600" },
  { key: "good", label: "Good", hint: "knew it", cls: "text-[var(--brand-teal)]" },
  { key: "easy", label: "Easy", hint: "too easy", cls: "text-sky-600" },
] as const;

export function FlashcardDeck() {
  const [cards, setCards] = useState<FCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [upcoming, setUpcoming] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<DueResponse>("/api/flashcards");
      setCards(data.cards);
      setUpcoming(data.upcomingCount);
      setIndex(0);
      setFlipped(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load flashcards.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rate = useCallback(
    async (rating: string) => {
      const card = cards[index];
      if (!card || submitting) return;
      setSubmitting(true);
      try {
        await apiFetch<{ ok: boolean }>("/api/flashcards/review", {
          method: "POST",
          body: JSON.stringify({ questionId: card.questionId, rating }),
        });
        // Remove the card from the deck (it was just scheduled again).
        const next = cards.filter((c) => c.questionId !== card.questionId);
        setCards(next);
        setIndex((i) => Math.min(i, Math.max(0, next.length - 1)));
        setFlipped(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save your rating.");
      } finally {
        setSubmitting(false);
      }
    },
    [cards, index, submitting]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl text-center text-muted-foreground">
        <Loader2 className="mx-auto size-6 animate-spin" /> Loading flashcards…
      </div>
    );
  }

  if (error) return <p className="mx-auto max-w-2xl text-sm text-destructive">{error}</p>;

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <Layers className="mx-auto size-10 text-[var(--brand-teal)]" aria-hidden />
          <h2 className="mt-4 text-2xl font-bold tracking-tight">No flashcards due</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Flashcards are created automatically from questions you answer. Practice
            or take the diagnostic and they will appear here on their review schedule.
            {upcoming > 0 && (
              <span className="mt-2 block font-medium text-foreground">
                {upcoming} card{upcoming === 1 ? "" : "s"} coming up later.
              </span>
            )}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="cta">
              <Link href="/practice">Practice questions</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/diagnostic">Take the diagnostic</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[index];
  if (!card) {
    return <div className="mx-auto max-w-2xl text-center text-muted-foreground">All done — well done!</div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {index + 1} of {cards.length} due
        </p>
        <div className="flex items-center gap-2">
          <DomainTag domain={card.question.domain} />
          <CareerBadge envType={card.question.envType} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        className="w-full cursor-pointer rounded-2xl border border-border bg-card p-8 text-left shadow-sm transition-all hover:border-primary/40"
      >
        {!flipped ? (
          <>
            <Badge variant="secondary" className="mb-4">Front — tap to reveal answer</Badge>
            <h2 className="text-lg font-semibold leading-relaxed">{card.question.stem}</h2>
            <div className="mt-5 space-y-2">
              {(["A", "B", "C", "D"] as const).map((l) => (
                <p key={l} className="text-sm text-muted-foreground">
                  <span className="mr-2 font-bold text-foreground">{l}.</span>
                  {card.question.options[l]}
                </p>
              ))}
            </div>
          </>
        ) : (
          <>
            <Badge className="mb-4 bg-[var(--brand-teal)] text-white">Answer — tap to go back to question</Badge>
            <p className="text-sm text-muted-foreground">
              Question <span className="font-semibold text-foreground">{card.question.stem}</span>
            </p>
            <p className="mt-4 text-lg font-semibold">
              Correct answer: {card.question.correctKey}.{" "}
              <span className="font-normal">
                {card.question.options[card.question.correctKey]}
              </span>
            </p>
            <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-semibold">Why this answer</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.question.explanation}
              </p>
            </div>
          </>
        )}
      </button>

      {flipped && (
        <div className="flex flex-wrap justify-center gap-2">
          {RATINGS.map((r) => (
            <Button
              key={r.key}
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={() => rate(r.key)}
            >
              <span className={r.cls}>{r.label}</span>
              <span className="text-xs text-muted-foreground">· {r.hint}</span>
            </Button>
          ))}
        </div>
      )}

      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RotateCcw className="size-4" /> Reload deck
        </Button>
      </div>
    </div>
  );
}