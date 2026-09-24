"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/practice", label: "Practice" },
  { href: "/simulator", label: "Simulator" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/blog", label: "Blog" },
  { href: "/curriculum", label: "2026 ECO" },
  { href: "/dashboard", label: "Progress" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 z-50 border-b border-border bg-card p-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button asChild variant="cta" size="sm">
              <Link href="/diagnostic" onClick={() => setOpen(false)}>
                Free diagnostic
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}