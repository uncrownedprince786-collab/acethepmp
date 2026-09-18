# Ace the PMP

A completely free, adaptive PMP preparation platform — original practice
questions, a realistic 180-question exam simulator, spaced-repetition
flashcards, a 2026 PMI ECO-aligned curriculum, and a provisional readiness
score. No accounts required to study (guest sessions save progress in a
cookie), no paywall, no pass guarantees sold.

> **Disclaimer:** This is a study aid only. It is **not affiliated with or
> endorsed by PMI**. Our readiness score is a study estimate — it is **not a
> predictor of exam success**, and no one can guarantee you will pass.

## Stack

- Next.js 15 (App Router, TypeScript, Tailwind CSS v4)
- Prisma 6 + PostgreSQL on Neon (SQLite was used during early prototyping)
- NextAuth v5 (Credentials + JWT), bcryptjs, zod
- lucide-react + shadcn-style UI components (cva, radix-slot)

## Getting started

```bash
npm install          # also runs `prisma generate` (postinstall)
```

Set up your environment file:

```bash
cp .env.example .env
```

Then paste your Neon connection strings into `.env`:

| Var | Value |
|-----|-------|
| `DATABASE_URL` | Neon **Pooled** connection string (`?sslmode=require`) |
| `DIRECT_URL`   | Neon **Direct** connection string (used by `db push`) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` locally, your domain in prod |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap/metadata |

Create the schema and load the seed content (44 original questions + a demo
account):

```bash
npm run db:push    # applies schema to the database
npm run db:seed    # 44 questions + demo@acethepmp.com / password123
npm run db:audit   # read-only data-quality check (tags, distribution, scoring)
```

Run the app:

```bash
npm run dev        # http://localhost:3000
```

Other scripts: `npm run db:studio`, `npm run db:reset` (force-reset + reseed),
`npm run build`, `npm run lint`.

## Deploying (Vercel + Neon)

1. Push this repo to GitHub (see `brain.md` for the remote).
2. In the **Neon** dashboard create a project (free tier is fine). Copy the
   **Pooled** and **Direct** connection strings.
3. In **Vercel**, import the repo. Add these Environment Variables (Production,
   Preview, Development):
   - `DATABASE_URL` (pooled)
   - `DIRECT_URL` (direct)
   - `NEXTAUTH_SECRET` (long random string)
   - `NEXTAUTH_URL` (e.g. `https://acethepmp.vercel.app`)
   - `NEXT_PUBLIC_SITE_URL` (same as `NEXTAUTH_URL`)
4. Build once, then apply schema + seed from your machine against Neon:
   ```bash
   npm run db:push
   npm run db:seed
   ```
   (`db:push` uses `DIRECT_URL`; the app talks to Neon via the pooled string.)

> Type `Question` enum/JSON columns map cleanly to Neon; no SQLite remnants
> remain in the schema.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page (FAQ + course JSON-LD) |
| `/diagnostic` | 10-question balanced diagnostic |
| `/practice` | Adaptive practice (weakest domain first) |
| `/simulator` | 180-question, 240-minute exam simulator with break interstitials |
| `/flashcards` | Spaced-repetition flashcard review (SM-2) |
| `/dashboard` | Readiness score, discipline breakdown, history (login required) |
| `/curriculum` | 2026 ECO: People 33% / Process 41% / Business Environment 26% |
| `/about` | Description + no-guarantee disclosure |
| `/login` `/register` | Optional accounts |
| `robots.txt` `sitemap.xml` | SEO |

## API

All endpoints create a guest session when none exists (`atp_session` cookie):
`/api/session`, `/api/register`, `/api/attempt`, `/api/practice/next`,
`/api/diagnostic`, `/api/assessments`, `/api/simulator`,
`/api/flashcards`, `/api/flashcards/review`, `/api/auth/[...nextauth]`.