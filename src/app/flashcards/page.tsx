import type { Metadata } from "next";
import { FlashcardDeck } from "@/components/flashcard-deck";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free PMP Flashcards",
  description:
    "Smart free PMP flashcards that schedule themselves around your memory. Cards come from the questions you practice, with spaced repetition built in.",
  path: "/flashcards",
  keywords: ["PMP flashcards", "spaced repetition PMP", "PMP memory cards"],
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