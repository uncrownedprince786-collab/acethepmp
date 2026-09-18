import type { Metadata } from "next";
import { DiagnosticRun } from "@/components/diagnostic-run";
import { Disclaimer } from "@/components/disclaimer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free PMP Diagnostic Test 2026 — Readiness Score",
  description:
    "Take a free 10-question PMP diagnostic across People, Process & Business Environment. See your domain strengths and readiness score instantly. Aligned to the 2026 ECO.",
  path: "/diagnostic",
  keywords: ["free PMP practice test", "PMP diagnostic 2026", "PMP gap analysis", "PMP readiness score"],
});

export default function DiagnosticPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <DiagnosticRun />
      <div className="mx-auto mt-8 max-w-2xl">
        <Disclaimer />
      </div>
    </div>
  );
}