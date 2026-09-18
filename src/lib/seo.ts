import type { Metadata } from "next";

// Production URL. Set NEXT_PUBLIC_SITE_URL in Vercel to the custom domain
// (e.g. https://acethepmp.com). Local/fallback is derived from the request
// host at runtime via NEXT_PUBLIC_SITE_URL.
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://acethepmp.com";

export const SITE = {
  name: "Ace the PMP",
  url: base,
  tagline: "Free adaptive PMP preparation",
  description:
    "Ace the PMP is a completely free, adaptive PMP preparation platform with original practice questions, a realistic exam simulator, AI-assisted explanations, and a readiness score aligned to the 2026 PMI Examination Content Outline.",
  keywords: [
    "free PMP practice questions",
    "PMP exam simulator 2026",
    "free PMP preparation",
    "2026 PMP exam",
    "PMP Examination Content Outline 2026",
    "adaptive PMP practice",
    "PMP readiness score",
    "PMP flashcards free",
    "free PMP diagnostic test",
    "PMP study free",
  ],
} as const;

/** Builds consistent, unique metadata for a page. */
export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    keywords: [...SITE.keywords, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
    },
  };
}