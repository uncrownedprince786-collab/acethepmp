import { Info } from "lucide-react";

/**
 * Standard honest-preparation disclaimer. Required on major pages per the
 * product brief — we never promise exam results.
 */
export function Disclaimer({ className }: { className?: string }) {
  return (
    <div
      className={
        "flex items-start gap-3 rounded-xl border border-border bg-muted/60 px-4 py-3 " +
        (className ?? "")
      }
    >
      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <p className="text-xs leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">
          Preparation only — no pass guarantee.
        </strong>{" "}
        This is a free study tool designed to build your knowledge of the PMP exam
        content. Your exam result depends on your own effort and preparation. We are
        not affiliated with PMI.
      </p>
    </div>
  );
}