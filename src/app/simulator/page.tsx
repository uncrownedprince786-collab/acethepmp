import type { Metadata } from "next";
import { SimulatorRun } from "@/components/simulator-run";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free PMP Exam Simulator 2026 — 180 Questions, 240 Minutes",
  description:
    "Realistic free PMP exam simulator: 180 questions, 240 minutes, two 10-minute breaks. ECO-proportional across People, Process & Business Environment. Review every answer.",
  path: "/simulator",
  keywords: ["PMP mock exam 2026", "PMP exam simulator free", "180 question PMP test", "PMP practice exam"],
});

export default function SimulatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight">Full-length exam simulator</h1>
        <p className="mt-2 text-muted-foreground">
          Real format, real timing, real pressure — with instant, reviewed explanations
          when it is over.
        </p>
        <p className="mt-3 text-muted-foreground">
          The real PMP lets you set the pace across 180 questions in 240 minutes with
          optional breaks, and this simulator replicates that exact format using the
          same original, ECO-tagged questions used across the site. Sit the full
          session with the timer on and you will learn stamina, pacing, and
          flag-and-review discipline that no single-topic quiz can teach. When it is
          over, everything is scored against the 2026 content outline, your flagged
          questions are surfaced, and every miss flows into the same practice record
          and flashcards — so each mock builds the study data for the real attempt.
        </p>
      </div>
      <SimulatorRun />
    </div>
  );
}