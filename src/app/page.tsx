import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  GraduationCap,
  Share2,
  Sparkles,
  Target,
  Timer,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/disclaimer";
import { DOMAIN_META, DOMAIN_ORDER, TASKS, ENV_META } from "@/lib/eco";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free Adaptive PMP Preparation Platform",
  description:
    "Completely free adaptive PMP practice aligned to the 2026 Examination Content Outline: original questions, realistic simulator, flashcards, and a readiness score. No paywalls — build complete PMP knowledge.",
  path: "/",
});

const features = [
  {
    icon: Brain,
    title: "Adaptive practice engine",
    body: "Questions adapt to your weakest domain and current level, keeping you in the learning zone instead of repeating what you already know.",
  },
  {
    icon: Timer,
    title: "Realistic exam simulator",
    body: "Exact 2026 structure: 180 questions, 230 minutes, and 10-minute breaks — so the real exam feels familiar, not foreign.",
  },
  {
    icon: BarChart3,
    title: "Honest readiness score",
    body: "A 0–100 measure of your knowledge strength across People, Process, and Business Environment. A guide for effort — not a pass guarantee.",
  },
  {
    icon: Wallet,
    title: "100% free, always",
    body: "No subscriptions, no locked questions, no one-time fees. Revenue only from non-intrusive ads later, never from your learning.",
  },
  {
    icon: Zap,
    title: "AI-assisted explanations",
    body: "Every answer explained: why it is correct and why the others are wrong — human-reviewed for accuracy and fairness.",
  },
  {
    icon: Share2,
    title: "Progress that follows you",
    body: "Start as a guest, create a free account, and keep your practice history and flashcards on any device.",
  },
];

const faqs = [
  {
    q: "Is Ace the PMP really free?",
    a: "Yes. Every question, every simulator run, every flashcard, and your readiness score are free today and intended to stay free. We may run non-intrusive ads in the future; we will never put core learning features behind a paywall.",
  },
  {
    q: "Does this guarantee I will pass the PMP?",
    a: "No. No honest platform can guarantee that. We build your knowledge and readiness with high-quality practice, but your exam result depends on your own effort, consistency, and preparation.",
  },
  {
    q: "Is the content aligned to the 2026 exam?",
    a: "Yes. Questions and curriculum are mapped to the 2026 PMI Examination Content Outline — the People (42%), Process (50%), and Business Environment (8%) domains and their tasks.",
  },
  {
    q: "I need an account to study?",
    a: "No. You can take the diagnostic and practice as a guest. Create a free account only if you want to keep your progress across devices. There is no premium tier.",
  },
  {
    q: "Where do the questions come from?",
    a: "They are originally written for this platform and mapped to the ECO, then human-reviewed. We do not copy from paid question banks and we never will.",
  },
  {
    q: "How long is the diagnostic?",
    a: "About 10 questions across all three domains, taking roughly 10–15 minutes. You get a domain-by-domain breakdown plus a starting readiness score.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Ace the PMP",
      url: "https://acethepmp.com",
      description:
        "Free adaptive PMP preparation platform with original practice questions and a realistic exam simulator.",
      inLanguage: "en",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-border/70 bg-gradient-to-b from-[#eef6f5] via-background to-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <Badge variant="secondary" className="gap-1.5">
              <Sparkles className="size-3" /> Free, adaptive, 2026-ECO aligned
            </Badge>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Build complete PMP knowledge.{" "}
              <span className="text-[var(--brand-teal)]">Free forever.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Original practice questions, a realistic 180-question simulator, smart
              flashcards, and a readiness score — all mapped to the 2026 PMI
              Examination Content Outline. No paywalls, ever.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="cta" size="lg">
                <Link href="/diagnostic">
                  Take the free diagnostic
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/curriculum">See the 2026 ECO roadmap</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Free sign-in optional · ~10–15 minutes · no account needed
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: GraduationCap, big: "People", sub: "42% · leadership & team", color: "#0F766E" },
              { icon: Target, big: "Process", sub: "50% · planning & execution", color: "#1E3A8A" },
              { icon: BarChart3, big: "Business Env.", sub: "8% · value & compliance", color: "#B45309" },
              { icon: CheckCircle2, big: "3 + 1 smart modes", sub: "practice · simulator · flashcards", color: "#0F766E" },
            ].map((c) => (
              <div
                key={c.big}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <c.icon className="size-6" style={{ color: c.color }} aria-hidden />
                <p className="mt-3 text-lg font-bold" style={{ color: c.color }}>
                  {c.big}
                </p>
                <p className="text-sm text-muted-foreground">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honest promise */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Disclaimer />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to prepare deeply
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built around one idea: complete understanding beats exam tricks.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-lg bg-[var(--brand-teal)]/10">
                  <f.icon className="size-5 text-[var(--brand-teal)]" aria-hidden />
                </div>
                <CardTitle className="mt-2">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ECO domains */}
      <section className="border-y border-border/70 bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Structured around the 2026 exam
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Every activity maps to the PMI Examination Content Outline. This is the
                same structure PMI uses to build the real exam.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/curriculum">Explore all 30 tasks</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {DOMAIN_ORDER.map((d) => (
              <Card key={d}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{DOMAIN_META[d].label}</CardTitle>
                    <Badge variant="secondary">{Math.round(DOMAIN_META[d].weight * 100)}% of exam</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {DOMAIN_META[d].blurb}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {TASKS[d].slice(0, 4).map((t) => (
                      <li key={t.id} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--brand-teal)]" aria-hidden />
                        <span>{t.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Env types strip */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {Object.entries(ENV_META).map(([k, v]) => (
              <div
                key={k}
                className="flex-1 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-sm font-semibold">{v.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{v.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator strip */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid items-center gap-8 rounded-2xl border border-[var(--brand-teal)]/25 bg-[var(--brand-teal)]/5 p-8 lg:grid-cols-2">
          <div>
            <Badge variant="default" className="mb-3">
              <Clock className="size-3" /> Exam-authentic
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              The simulator that removes exam-day surprises
            </h2>
            <p className="mt-3 text-muted-foreground">
              180 questions · 230 minutes · two 10-minute breaks — with domain
              proportions that mirror the real paper. Practice under real conditions,
              then review every answer with a human-reviewed explanation.
            </p>
            <div className="mt-6">
              <Button asChild variant="cta">
                <Link href="/simulator">
                  Open the simulator <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold text-foreground">How a session feels</p>
            <ul className="mt-4 space-y-3">
              {[
                "Questions shown one at a time, exactly like the real interface",
                "Flag questions to review before you submit",
                "Timer with automatic breaks after question 60 and 120",
                "Instant score, domain breakdown, and full answer review",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--brand-teal)]" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/70 bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            From diagnostic to exam-day confidence
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Take the free diagnostic", body: "10 questions, ~15 minutes. See where you stand in all three domains with a starting readiness score." },
              { step: "2", title: "Let the engine adapt", body: "Adaptive practice targets your weakest domain at the right difficulty. Every answer gets a full explanation." },
              { step: "3", title: "Validate with the simulator", body: "Watch your readiness score grow, then prove it under real exam conditions with full-length mocks." },
            ].map((s) => (
              <div key={s.step} className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-full bg-[var(--brand-teal)] text-sm font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl bg-[var(--brand-teal)] px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Your first step takes 15 minutes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Start the free diagnostic now. See your strengths, find your gaps, and let
            the engine plan your preparation from day one.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild variant="cta" size="lg">
              <Link href="/diagnostic">
                Start the free diagnostic <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-white/70">
            Free forever · no account needed to begin · fair, honest practice
          </p>
        </div>
      </section>
    </>
  );
}