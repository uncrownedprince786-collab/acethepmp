import type { Metadata } from "next";
import { SimulatorRun } from "@/components/simulator-run";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free PMP Exam Simulator — 180 Questions, Realistic Timing",
  description:
    "Take a full-length free PMP exam simulation: 180 questions across People, Process, and Business Environment with 240 minutes and two 10-minute breaks, then review every answer.",
  path: "/simulator",
  keywords: ["PMP mock exam", "PMP exam simulator", "180 question PMP test"],
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
      </div>
      <SimulatorRun />
    </div>
  );
}