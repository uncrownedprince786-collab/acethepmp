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
      </div>
      <PracticeRun />
    </div>
  );
}