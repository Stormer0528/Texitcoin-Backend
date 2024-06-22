import { PrismaClient } from '@prisma/client';

import { userData } from '../../prisma/seed/user';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await prisma.user.createMany({ data: userData, skipDuplicates: true });

  console.log('Finished seed');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
