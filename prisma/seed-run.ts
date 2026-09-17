// Entrypoint for `prisma db seed` / `npm run db:seed`.
// Kept separate so prisma/seed.ts can be imported for its data without
// accidentally running the seed (see prisma/retag-eco.ts).

import { main, prisma } from "./seed";

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
