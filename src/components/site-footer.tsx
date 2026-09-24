import Link from "next/link";
import { Logo } from "@/components/logo";

const columns = [
  {
    title: "Study",
    links: [
      { href: "/diagnostic", label: "Free diagnostic test" },
      { href: "/practice", label: "Adaptive practice" },
      { href: "/simulator", label: "Exam simulator" },
      { href: "/flashcards", label: "Flashcards" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "PMP blog & guides" },
      { href: "/curriculum", label: "2026 ECO roadmap" },
      { href: "/about", label: "About & our promise" },
      { href: "/dashboard", label: "Readiness score" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Free adaptive PMP preparation built to give you complete knowledge of the
              2026 exam content outline. No subscriptions, no paywalls, ever.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-muted/60 p-4">
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Ace the PMP is an independent preparation platform. Not affiliated with PMI. No pass guarantee.</strong>{" "}
            PMI, PMP and PMBOK are registered marks of the Project Management Institute, Inc.
            This platform is a study aid only and does not guarantee exam results.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Ace the PMP. Free forever.</p>
          <p>Built for learners, not for paywalls.</p>
        </div>
      </div>
    </footer>
  );
}