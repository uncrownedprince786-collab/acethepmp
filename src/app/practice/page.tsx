import type { Metadata } from "next";
import { PracticeRun } from "@/components/practice-run";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free PMP Practice Questions 2026 — Adaptive Engine",
  description:
    "Adaptive PMP practice questions mapped to the 2026 exam content outline. Targets your weakest domain at the right difficulty. Explanations included. Completely free.",
  path: "/practice",
  keywords: ["adaptive PMP practice", "PMP practice questions free", "PMP exam prep 2026"],
});

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mx-auto mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Adaptive practice</h1>
        <p className="mt-2 text-muted-foreground">
          The engine studies your answers and focuses on your weakest domain at the
          right difficulty, keeping you in the zone where learning happens fastest.
        </p>
        <p className="mt-3 text-muted-foreground">
          The 2026 PMP exam is built from PMI&apos;s Examination Content Outline —
          People (33%), Process (41%), and Business Environment (26%) — and every
          question here is tagged to a domain and task from that outline. Answer a
          few questions and the engine re-targets your weakest domain, so each
          session closes a real gap instead of repeating what you already know.
          When you miss one, the explanation walks through the reasoning, and repeat
          sessions rotate across the full 40+ original question bank. Use it before
          the simulator: building understanding first makes those 180 questions far
          less intimidating.
        </p>
      </div>
      <PracticeRun />
    </div>
  );
}