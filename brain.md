# Ace the PMP — brain.md

> Handoff / planning doc for the Ace the PMP codebase. Keep this in sync when
> the product, content, or deployment changes.

## 1. Business objective

**FREE → VALUE → TRUST.** A completely free, no-paywall PMP preparation
platform that ranks for high-intent keywords ("PMP practice questions", "PMP
exam simulator", "2026 PMP exam"), delivers genuine study value (original
questions + realistic simulator + adaptive practice), earns trust through
transparency, and has no paid tier. Monetization (if any later) must never
compromise the free experience.

**Hard rules (non-negotiable):**
- Everything is free, forever.
- Content must be original and human-reviewed; no copied PMP bank questions.
- Honest, prominent disclaimers everywhere: "not affiliated with PMI", "no
  pass guarantee", readiness score is an estimate, not a predictor.
- No fabricated stats, no invented pass rates.

## 2. Product status

**LIVE and end-to-end verified** on Vercel + Neon. The full learner journey
(register → sign in → diagnostic → adaptive practice → flashcards → simulator →
dashboard) passes on production — see §5–§6.

### Token system
- Palette: primary `#0F766E` teal, CTA `#F59E0B` amber, accent `#1E3A8A`
  navy, bg `#F8FAFC`, text `#0F172A`. Font: Inter (next/font).
- Tailwind v4 tokens defined in `src/app/globals.css` (`@theme`).

### Stack
- Next.js 15.5 (App Router, TS, Tailwind v4), React 19.
- Prisma 6 (PostgreSQL datasource; SQLite used in prototyping only).
- NextAuth 5 beta (Credentials + JWT), bcryptjs, zod v4.
- UI: shadcn-style components (cva, clsx, tailwind-merge, radix-slot,
  lucide icons). No external UI framework.

## 3. Data model (`prisma/schema.prisma`)

- `User` — email/password (bcrypt), optional account to sync progress.
- `Session` — guest session: `token` (unique `atp_session` cookie) with
  optional `userId`. Guest progress links to the User on sign-in via
  `getOrCreateSession()` (`src/lib/session-server.ts`).
- `Question` — domain/task/envType/difficulty/stem/4 options/correctKey/
  explanation/status (DRAFT→REVIEWED→PUBLISHED→ARCHIVED).
- `Attempt` — per-session answer rows (selectedKey, isCorrect, timeSeconds).
- `Progress` — per session×question mastery (timesSeen/Right/Wrong, streak,
  interval/dueAt for spaced repetition, cardRating SM-2 1–5).
- `DiagnosticResult` — completed diagnostic/simulator runs (domainScores JSON,
  readiness 0–100).

## 4. Routes / features built

| Route | Feature |
|-------|---------|
| `/` | Landing: hero, features, DOMAIN/ECO grid, FAQ + WebSite/FAQ JSON-LD, footer disclaimer |
| `/diagnostic` | 10-question balanced diagnostic across the three domains; stores result + readiness |
| `/practice` | Adaptive practice — weakest ECO domain first, difficulty bands, no answer-key leak |
| `/simulator` | 180 Q / 240 min, ECO-proportional (33/41/26) exam selection, palette + flagging, breaks after Q60/Q120 |
| `/flashcards` | SM-2 spaced repetition from practice misses; "again/hard/good/easy" ratings |
| `/blog`, `/blog/[slug]` | 13 original long-tail study guides (2026 format facts, 26 ECO tasks by domain, cost/requirements, strategy); BlogPosting JSON-LD, internal links into tools |
| `/dashboard` | Readiness gauge, per-domain bars, streak, attempt history (login required, noindex) |
| `/curriculum` | 2026 ECO tasks: People 33% / Process 41% / Business Environment 26% (+ Course JSON-LD) |
| `/about`, `/login`, `/register` | Disclosure, auth flows (password fields have show/hide eye toggle via `src/components/auth/password-input.tsx`) |
| `robots.txt`, `sitemap.xml` | Generated from `src/lib/seo.ts` `SITE` |
| `manifest.webmanifest` | PWA manifest (`src/app/manifest.ts`) |
| `opengraph-image` | Dynamic OG image (`src/app/opengraph-image.tsx`) |
| `offline.html` | Branded offline fallback page (`public/offline.html`) |

APIs (`/api/...`): session, register, attempt, practice/next, diagnostic,
assessments, simulator (incl. lightweight `?meta=1` bank summary for the intro
screen), flashcards, flashcards/review, auth/[...nextauth]. Guest sessions boot
automatically via `GET /api/session`.

## 5. Verification to-date

- `npm run build` ✅ (Next 15.5.25, zero type errors; 32 static/SSG routes — 14
  base pages + `/icon` + `/apple-icon` + `/blog` + 13 posts; sitemap = 21 URLs,
  robots generated).
- `npm run lint` ✅ (eslint-config-next: no errors; warnings cleaned).
- **Full E2E user-flow suite ✅ 74/74 — run locally (dev server, Neon DB).**
  Script drives a real browser-like cookie jar through: guest session boot →
  register (incl. short-password + duplicate-email rejection) → wrong-password
  sign-in rejected (no session, guest cookie preserved) → NextAuth credentials
  sign-in → session retained through login → 10-question diagnostic + attempts
  + assessment → adaptive practice (5 answers) → change-an-answer (repeat
  attempt + progress counters) → flashcards due-set + SM-2 review → 130-question
  ECO-proportional simulator (+ meta endpoint, domain-mix drift <6pp) →
  simulator scoring edge cases (empty submit = 0%, full-exam denominator for
  partial/empty runs) → authenticated `/dashboard` renders → input validation
  errors → sign-out. Also asserts practice/simulator/diagnostic payloads never
  leak `correctKey`, diagnostic questions are unique, and the favicon routes
  serve PNGs.
- Earlier runtime smoke tests ✅ against `next start` (still hold):
  - `/api/session` boots a guest session (200).
  - `/api/diagnostic` returns 10 questions, domain-balanced.
  - `/api/attempt` records answers, computes isCorrect, returns explanation +
    updates progress/streak.
  - `/api/assessments` completes a run, computes readiness + needs text.
  - `/api/simulator` returns the ECO-proportional 44-question bank (`?meta=1`
    reports bank size + per-domain counts for the intro screen).
  - `/api/flashcards` only surfaces **due** cards (empty until practice
    creates dueAt≤now); `/api/flashcards/review` updates SM-2 interval/dueAt.
- Practice payload intentionally omits `correctKey` (verified no answer-key
  leak).
- **Blog smoke test ✅ (local `next start`):** `/blog` + all 13 posts return
  200 with `BlogPosting` JSON-LD; inline **bold** / *italic* / `[link](/path)`
  formatting renders (incl. escaped quotes), CTAs and related-post links point
  into the tools, sitemap lists 21 URLs.

## 6. Deployment (Vercel + Neon)

- **Repo:** github.com/uncrownedprince786-collab/acethepmp (default branch
  `master`).
- **DB:** Neon serverless Postgres. `.env.example` documents the required
  vars; schema `provider = "postgresql"`, `directUrl = env("DIRECT_URL")`
  (pooled vs direct connection strings).
- **Vercel project `acethepmp`:** production **LIVE** —
  **https://acethepmp.vercel.app** (primary; the long
  `acethepmp-uncrownedprince786-6663s-projects.vercel.app` also resolves).
  - `NEXT_PUBLIC_SITE_URL` + `NEXTAUTH_URL` are set to the short
    `https://acethepmp.vercel.app` so canonical/OG/sitemap and auth callbacks
    use it. Verified after switching domains — the full E2E suite passed on
    production.
  - Env vars set for Production: `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL`,
    `NEXTAUTH_SECRET` (generated), `DATABASE_URL` (Neon pooled),
    `DIRECT_URL` (Neon direct). ✅
  - Framework Preset = **Next.js** (was "Other" → plain static 404s), Deploy
    Protection = off.
  - All pages return HTTP 200. The latest 74-check E2E suite passes against the
    local dev server + Neon DB; after each push, re-run it with
    `BASE=https://acethepmp.vercel.app` once the deploy settles to confirm the
    same pass on production.
  - Production deploys: with Framework fixed, pushes to the production branch
    deploy correctly (`vercel deploy --prod` also used).
  - Reason for an earlier Production error: Next.js 15.5.4 was flagged
    "Vulnerable version detected"; fixed by upgrading to Next **15.5.25**.
- **Database:** `npm run db:push` + `npm run db:seed` run against Neon
  (schema in sync, 44 questions + demo user). `db:seed` is idempotent (inserts
  only unseen stems). `db:retag` re-applies ECO tags (matched by `stem`),
  `db:audit` runs a read-only integrity/distribution/scoring check.
  `postinstall: prisma generate` ensures the client exists at build time.
- The E2E runs create throwaway `e2e_<timestamp>@example.com` accounts in Neon;
  prune with a `deleteMany` on `User` where email starts with `e2e_` if desired.

## 7. Known gaps / next steps

0. **2026 ECO task taxonomy migration:** ✅ done. `src/lib/eco.ts` now carries the
   authoritative July 2026 ECO — People 33% / Process 41% / Business Environment
   26%, 240 minutes, and the consolidated 26 tasks (People 8 / Process 10 / BE 8),
   with no asserted pass threshold; `src/lib/adaptive.ts` derives its sampling
   cutoff from the weights. Question tags are driven by `prisma/eco-tags.ts`
   (single source of truth, index-aligned with `prisma/seed.ts`), applied at seed
   time and migrated onto existing rows with `npm run db:retag` (non-destructive,
   idempotent, matched by `stem`). The seed entrypoint moved to
   `prisma/seed-run.ts`; `prisma/seed.ts` is now side-effect free and idempotent
   (inserts only stems not already in the bank). Bank now **130 original
   questions: People 43 / Process 53 / BE 34** — 33.1% / 40.8% / 26.2%, within
   0.2 pp of the ECO weights, and **every one of the 26 tasks has ≥3
   questions** (verified by `npm run db:audit`, a read-only
   integrity/distribution/scoring check). The simulator samples exams to the
   33/41/26 proportions (weight-based allocation, largest remainder capped by
   supply) and `GET /api/simulator?meta=1` feeds the intro card with the real
   bank size instead of "loading…". Brand favicon + iOS icon added
   (`src/app/icon.tsx`, `src/app/apple-icon.tsx`).
1. **Question bank scale:** 130 questions across all 26 tasks (≥3 each).
   Target 200+ original, human-reviewed items. As the bank grows, hold the
   domain split near the 2026 ECO proportions (33 / 41 / 26) — `npm run
   db:audit` reports the drift and fails if any domain strays more than 8 pp.
2. **Production secrets:** ✅ done — real `NEXTAUTH_SECRET` generated and set in
   Vercel; local `.env` still uses a dev-only secret + Neon URLs (gitignored).
3. **`brain.md` → README consistency:** README duplicates setup; keep both
   current.
4. **Prisma 7 migration:** `prisma db push` warns `package.json#prisma` is
   deprecated; move config to `prisma.config.ts` on upgrade.
5. **Auth hardening:** rate-limit `/api/register`, consider email verification
   later; NextAuth remains beta (pin the version).
6. **Admin/content workflow:** a route to add/edit questions with human review
   (REVIEWED→PUBLISHED) is the natural next feature.
7. **Analytics:** privacy-friendly analytics (Plausible/Umami) once live.
8. **Legal:** privacy policy + terms pages (footer currently points to /about
   disclosure only).
9. **SEO content & discovery (in progress):** 13 blog guides shipped Sep 2026 as
   the first long-tail content layer (`src/content/posts.ts` is the data store;
   no CMS/deps). Next: request-index the `/blog` URLs in GSC, register Bing
   Webmaster Tools + IndexNow, add privacy-friendly analytics
   (Plausible/Umami), and keep publishing toward long-tail volume.