import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/disclaimer";
import { DOMAIN_META, DOMAIN_ORDER, TASKS, ENV_META } from "@/lib/eco";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "2026 PMP Exam Content Outline Roadmap",
  description:
    "The complete free PMP study roadmap aligned to the 2026 Examination Content Outline: all 3 domains and all 30 tasks of People, Process, and Business Environment, each with original practice questions.",
  path: "/curriculum",
  keywords: ["PMP ECO 2026", "PMP domains tasks", "PMP study roadmap", "PMP syllabus free"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Ace the PMP — 2026 ECO-aligned PMP preparation",
  description:
    "Free, adaptive PMP preparation covering the People, Process, and Business Environment domains of the 2026 PMI Examination Content Outline with original practice questions.",
  provider: { "@type": "Organization", name: "Ace the PMP", sameAs: "https://acethepmp.com" },
  inLanguage: "en",
};

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-teal)]">
          Free study roadmap
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          The 2026 PMP Examination Content Outline — mapped, explained, practiced
        </h1>
        <p className="mt-3 text-muted-foreground">
          PMI builds the real exam from this exact structure. Every question on this
          platform is tagged to a domain and task below, so your practice always feeds
          a complete picture of the outline.
        </p>
      </div>

      <div className="mt-8 grid gap-8">
        {DOMAIN_ORDER.map((d) => {
          const meta = DOMAIN_META[d];
          const tasks = TASKS[d];
          return (
            <Card key={d} className="scroll-mt-24 p-0 shadow-sm">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-xl" style={{ color: meta.color }}>
                    Domain: {meta.label}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {Math.round(meta.weight * 100)}% of exam
                    </Badge>
                    <Badge variant="outline">{tasks.length} tasks</Badge>
                  </div>
                </div>
                <CardDescription className="max-w-3xl">{meta.blurb}</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {tasks.map((t) => (
                    <li
                      key={t.id}
                      className="rounded-xl border border-border/70 bg-muted/30 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                          style={{ backgroundColor: meta.color }}
                        >
                          {t.id}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{t.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-1 size-6 shrink-0 text-[var(--brand-teal)]" aria-hidden />
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              How the exam blends delivery approaches
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Questions are set in different project environments. PMI expects you to
              tailor your thinking to the context, not to memorise one method.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {Object.entries(ENV_META).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-sm font-semibold">{v.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{v.blurb}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {["Conflict", "Risk", "Schedule", "Quality", "Procurement", "Stakeholders", "Benefits", "Compliance"].map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <CheckCircle2 className="size-6 text-[var(--brand-teal)]" aria-hidden />
          <h3 className="mt-3 text-lg font-semibold">Read the roadmap, then practice it</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The diagnostic tells you which domain to attack first. Adaptive practice does
            the rest automatically.
          </p>
          <Button asChild variant="cta" className="mt-4">
            <Link href="/diagnostic">
              Start with the free diagnostic <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <CheckCircle2 className="size-6 text-[var(--brand-teal)]" aria-hidden />
          <h3 className="mt-3 text-lg font-semibold">Practice by domain or task</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Adaptive practice always routes you to your weakest area — so the roadmap
            is never just theory.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/practice">
              Open adaptive practice <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <Disclaimer />
      </div>
    </div>
  );
}