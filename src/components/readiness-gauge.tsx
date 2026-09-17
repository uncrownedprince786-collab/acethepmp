"use client";

import { cn } from "@/lib/utils";

function colorForScore(score: number) {
  if (score >= 85) return "var(--brand-teal)";
  if (score >= 70) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#f97316";
}

/** SVG arc gauge showing 0-100 readiness. */
export function ReadinessGauge({
  value,
  size = 160,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
}) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value)) / 100;
  const dash = c * pct;
  const color = colorForScore(value);

  return (
    <div
      className="inline-flex flex-col items-center gap-3"
      role="img"
      aria-label={`Readiness score ${Math.round(value)} out of 100`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tabular-nums" style={{ color }}>
            {Math.round(value)}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {label ?? "Readiness"}
          </span>
        </div>
      </div>
      {sublabel && (
        <p className={cn("text-sm font-medium text-muted-foreground")}>{sublabel}</p>
      )}
    </div>
  );
}