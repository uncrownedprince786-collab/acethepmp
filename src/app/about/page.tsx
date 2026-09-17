import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/disclaimer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About — Our Promise & How Questions Are Made",
  description:
    "Ace the PMP is independent, completely free, and built on original, human-reviewed content. Learn how we make questions and why we never promise exam results.",
  path: "/about",
});

const pillars = [
  {
    title: "Completely free, forever",
    body: "No subscriptions, no one-time fees, no premium tier that locks core study features. If we ever run ads, they will never block your learning.",
  },
  {
    title: "Original, human-reviewed content",
    body: "Every question and explanation is originally written for this platform, mapped to a specific ECO domain plus task, and reviewed for accuracy and fairness. We never copy paid question banks.",
  },
  {
    title: "Honest about results",
    body: "We measure your knowledge strength with a readiness score. We do not guarantee a pass, and we say so — because a platform that promises certainty is not helping you.",
  },
  {
    title: "Knowledge before tricks",
    body: "We focus on helping you understand why an answer is right and the others are wrong, so the knowledge stays with you beyond exam day.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-teal)]">
        About Ace the PMP
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Free PMP preparation, built on trust
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Ace the PMP is a free preparation platform designed to help you build complete
        knowledge of the PMP exam content. We do not guarantee that you will pass the
        exam. Your result depends on your own effort and preparation.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {pillars.map((p) => (
          <div key={p.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight">How questions are made</h2>
        <ol className="mt-5 space-y-4">
          {[
            {
              title: "1. Careful drafting",
              body: "AI assists a first draft based on the 2026 ECO — then a human rewrites it to be scenario-realistic and unambiguous.",
            },
            {
              title: "2. Mapping to the ECO",
              body: "Each question is tagged to one of the 3 domains and one of the 26 tasks, so it is always possible to see where it fits the outline.",
            },
            {
              title: "3. Answer + four reasons",
              body: "Every question ships with the correct answer, an explanation of why it is correct, and why the other three options are wrong.",
            },
            {
              title: "4. Multiple reviews",
              body: "High-stakes mock questions get at least three human reviews before publication, plus a quality score we use internally.",
            },
          ].map((s) => (
            <li key={s.title} className="rounded-xl border border-border/70 bg-muted/30 p-4">
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Affiliation</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ace the PMP is an independent preparation platform. It is not affiliated with,
          sponsored by, or endorsed by the Project Management Institute (PMI). PMP,
          PMBOK, and PMI are registered marks of the Project Management Institute, Inc.
          The 2026 Examination Content Outline is published by PMI and used here as a
          factual reference for study structure.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Independent</Badge>
          <Badge variant="outline">Free forever</Badge>
          <Badge variant="outline">Original content</Badge>
          <Badge variant="outline">No pass guarantee</Badge>
        </div>
      </div>

      <div className="mt-10">
        <Disclaimer />
      </div>
    </div>
  );
}