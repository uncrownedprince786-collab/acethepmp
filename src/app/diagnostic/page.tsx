import type { Metadata } from "next";
import { DiagnosticRun } from "@/components/diagnostic-run";
import { Disclaimer } from "@/components/disclaimer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free PMP Diagnostic Test",
  description:
    "Take the free PMP diagnostic test: 10 original questions across People, Process, and Business Environment. Get a domain-by-domain breakdown and a starting readiness score.",
  path: "/diagnostic",
  keywords: ["free PMP practice test", "PMP diagnostic", "PMP gap analysis"],
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