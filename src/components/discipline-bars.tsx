"use client";

import { DOMAIN_META, DOMAIN_ORDER } from "@/lib/eco";
import type { ReadinessBreakdown } from "@/lib/readiness";

/** Per-domain accuracy bars for the dashboard. */
export function DisciplineBars({
  domainScores,
}: {
  domainScores: ReadinessBreakdown["domainScores"];
}) {
  return (
    <CardShell>
      <div className="space-y-5">
        {DOMAIN_ORDER.map((d) => {
          const s = domainScores[d];
          const pct = s.accuracy === null ? null : Math.round(s.accuracy * 100);
          const meta = DOMAIN_META[d];
          return (
            <div key={d}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">
                  {meta.label}
                  <span className="ml-2 font-normal text-muted-foreground">
                    {Math.round(meta.weight * 100)}% of exam
                  </span>
                </span>
                <span className="font-bold tabular-nums" style={{ color: meta.color }}>
                  {pct === null ? "not practiced" : `${pct}%`}
                </span>
              </div>
              <div
                className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct ?? 0}
                aria-label={`${meta.label} accuracy`}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct ?? 0}%`, backgroundColor: meta.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
      <p className="mb-4 text-sm font-semibold">Domain accuracy</p>
      {children}
    </div>
  );
}