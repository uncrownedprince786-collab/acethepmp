// Non-destructive migration: re-tag existing questions with the authoritative
// 2026 ECO domain + task from prisma/eco-tags.ts.
//
// It matches rows by `stem` and updates only the `domain`/`task` columns. It
// never deletes, inserts, or duplicates anything, so it is safe to run against
// the live database and safe to run more than once (idempotent).
//
// Usage: npm run db:retag

import { ECO_TAGS } from "./eco-tags";
import { prisma, questions } from "./seed";

async function main() {
  if (ECO_TAGS.length !== questions.length) {
    throw new Error(
      `ECO_TAGS has ${ECO_TAGS.length} entries but questions has ${questions.length}. They must stay index-aligned.`
    );
  }

  let updated = 0;
  let unmatched = 0;

  for (let i = 0; i < questions.length; i++) {
    const { domain, task } = ECO_TAGS[i];
    const res = await prisma.question.updateMany({
      where: { stem: questions[i].stem },
      data: { domain, task },
    });
    if (res.count === 0) {
      unmatched += 1;
      console.warn(
        `No question matched (index ${i}): "${questions[i].stem.slice(0, 60)}..."`
      );
    } else {
      updated += res.count;
    }
  }

  const total = await prisma.question.count();
  console.log(
    `Retag complete: ${updated} row(s) updated, ${unmatched} unmatched. Bank now ${total} questions.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
