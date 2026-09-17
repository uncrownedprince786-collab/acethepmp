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
| `/simulator` | 180 Q / 230 min, domain-interleaved bank, palette + flagging, breaks after Q60/Q120 |
| `/flashcards` | SM-2 spaced repetition from practice misses; "again/hard/good/easy" ratings |
| `/dashboard` | Readiness gauge, per-domain bars, streak, attempt history (login required, noindex) |
| `/curriculum` | 2026 ECO tasks: People 42% / Process 50% / Business Environment 8% (+ Course JSON-LD) |
| `/about`, `/login`, `/register` | Disclosure, auth flows (password fields have show/hide eye toggle via `src/components/auth/password-input.tsx`) |
| `robots.txt`, `sitemap.xml` | Generated from `src/lib/seo.ts` `SITE` |

APIs (`/api/...`): session, register, attempt, practice/next, diagnostic,
assessments, simulator, flashcards, flashcards/review,
auth/[...nextauth]. Guest sessions boot automatically via `GET /api/session`.

## 5. Verification to-date

- `npm run build` ✅ (Next 15.5.25, zero type errors, all 15 routes compile,
  sitemap + robots generated).
- `npm run lint` ✅ (eslint-config-next: no errors; warnings cleaned).
- **Full E2E user-flow suite ✅ 58/58 — run against both local (`next start`)
  and the live Vercel production URL.** Script drives a real browser-like
  cookie jar through: guest session boot → register (incl. short-password +
  duplicate-email rejection) → NextAuth credentials sign-in → session retained
  through login → 10-question diagnostic + attempts + assessment → adaptive
  practice (5 answers) → flashcards due-set + SM-2 review → 32-question
  simulator + assessment → authenticated `/dashboard` renders → input
  validation errors → sign-out. Also asserts practice/simulator/diagnostic
  payloads never leak `correctKey` and diagnostic questions are unique.
- Earlier runtime smoke tests ✅ against `next start` (still hold):
  - `/api/session` boots a guest session (200).
  - `/api/diagnostic` returns 10 questions, domain-balanced.
  - `/api/attempt` records answers, computes isCorrect, returns explanation +
    updates progress/streak.
  - `/api/assessments` completes a run, computes readiness + needs text.
  - `/api/simulator` returns the interleaved 32-question bank.
  - `/api/flashcards` only surfaces **due** cards (empty until practice
    creates dueAt≤now); `/api/flashcards/review` updates SM-2 interval/dueAt.
- Practice payload intentionally omits `correctKey` (verified no answer-key
  leak).

## 6. Deployment (Vercel + Neon)

- **Repo:** github.com/uncrownedprince786-collab/acethepmp (default branch
  `master`).
- **DB:** Neon serverless Postgres. `.env.example` documents the required
  vars; schema `provider = "postgresql"`, `directUrl = env("DIRECT_URL")`
  (pooled vs direct connection strings).
- **Vercel project `acethepmp`:** production **LIVE** —
  https://acethepmp-uncrownedprince786-6663s-projects.vercel.app
  - Env vars set for Production: `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL`,
    `NEXTAUTH_SECRET` (generated), `DATABASE_URL` (Neon pooled),
    `DIRECT_URL` (Neon direct). ✅
  - Framework Preset = **Next.js** (was "Other" → plain static 404s), Deploy
    Protection = off.
  - All pages return HTTP 200 and the full E2E suite passes on production.
  - Production deploys: with Framework fixed, pushes to the production branch
    deploy correctly (`vercel deploy --prod` also used).
  - Reason for an earlier Production error: Next.js 15.5.4 was flagged
    "Vulnerable version detected"; fixed by upgrading to Next **15.5.25**.
- **Database:** `npm run db:push` + `npm run db:seed` run against Neon
  (schema in sync, 32 questions + demo user). `postinstall: prisma generate`
  ensures the client exists at build time.
- The E2E runs create throwaway `e2e_<timestamp>@example.com` accounts in Neon;
  prune with a `deleteMany` on `User` where email starts with `e2e_` if desired.

## 7. Known gaps / next steps

1. **Question bank scale:** 32 questions is a demo volume. Target 200+
   original, human-reviewed items before leaning on the simulator as a
   marketing claim. Expand per-domain: People ≥ 50%, Process ≥ 50%, BE ≥ 20.
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