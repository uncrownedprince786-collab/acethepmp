import Link from "next/link";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Ace the PMP — home"
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--brand-teal)] text-white shadow-sm transition-transform group-hover:scale-105">
        <Target className="size-5" aria-hidden />
      </span>
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          dark ? "text-white" : "text-foreground"
        )}
      >
        Ace<span className="ml-1 text-[var(--brand-teal)]">the PMP</span>
      </span>
    </Link>
  );
}