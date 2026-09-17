"use client";

import { cn } from "@/lib/utils";

export type OptionState = "idle" | "selected" | "correct" | "wrong" | "dim";

type Letter = "A" | "B" | "C" | "D";

/**
 * A single multiple-choice option row. Reused by practice, diagnostic,
 * simulator, and review views.
 */
export function QuestionOption({
  letter,
  text,
  state = "idle",
  disabled = false,
  onSelect,
}: {
  letter: Letter;
  text: string;
  state?: OptionState;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  const interactive = state === "idle" && !disabled;
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!interactive}
      aria-pressed={state === "selected"}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border bg-card p-4 text-left transition-all",
        interactive && "hover:border-primary/50 hover:bg-primary/5 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/40 cursor-pointer",
        state === "selected" && "border-primary bg-primary/5 ring-1 ring-primary/30",
        state === "correct" && "border-success/60 bg-success/10",
        state === "wrong" && "border-destructive/60 bg-destructive/10",
        state === "dim" && "border-border opacity-55"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors",
          state === "correct" && "border-success bg-success text-white",
          state === "wrong" && "border-destructive bg-destructive text-white",
          state === "selected" && "border-primary bg-primary text-white",
          state === "idle" && "border-border bg-muted text-muted-foreground group-hover:border-primary/40",
          state === "dim" && "border-border bg-muted text-muted-foreground"
        )}
      >
        {letter}
      </span>
      <span className="text-sm leading-relaxed text-foreground">{text}</span>
    </button>
  );
}