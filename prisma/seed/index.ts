import { PrismaClient } from '@prisma/client';

import { getSales } from '../../src/utils/connectMlm';
import {
  getUserFromMlm,
  getStatisticsFromMlm,
  getUserStatisticsFromMlm,
} from '../../src/utils/getMlmData';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await Promise.all([prisma.sale.deleteMany({}), prisma.user.deleteMany({})]);

  const [users, statistics] = await Promise.all([getUserFromMlm(), getStatisticsFromMlm()]);

  await prisma.statistics.createMany({ data: statistics });
  await prisma.user.createMany({ data: users, skipDuplicates: true });

  const [sales, userStatistics] = await Promise.all([getSales(), getUserStatisticsFromMlm()]);

  await prisma.sale.createMany({ data: sales });
  await prisma.userStatistics.createMany({ data: userStatistics });

  console.log(`Seeding finished.`);
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
