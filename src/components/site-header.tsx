import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
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

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/85 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="cta" size="sm">
            <Link href="/diagnostic">Free diagnostic</Link>
          </Button>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}