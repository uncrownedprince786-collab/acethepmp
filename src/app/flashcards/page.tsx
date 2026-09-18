import type { Metadata } from "next";
import { FlashcardDeck } from "@/components/flashcard-deck";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free PMP Flashcards 2026 — Spaced Repetition",
  description:
    "Smart free PMP flashcards with spaced repetition. Cards are generated from your practice misses, scheduled so you revisit them right before you forget. 2026 ECO aligned.",
  path: "/flashcards",
  keywords: ["PMP flashcards free", "spaced repetition PMP", "PMP memory cards", "PMP flashcards 2026"],
});

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
        <p className="mt-2 text-muted-foreground">
          Every question you answer becomes a card, spaced so you revisit it right
          before you would forget it.
        </p>
      </div>
      <FlashcardDeck />
    </div>
  );
}