import fs from 'fs';
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

  console.log('Connected to the MariaDB');

  const [users, statistics] = await Promise.all([getUserFromMlm(), getStatisticsFromMlm()]);

  await prisma.statistics.createMany({ data: statistics });
  await prisma.user.createMany({ data: users, skipDuplicates: true });

  const [sales] = await Promise.all([getSales()]);

  // await prisma.userStatistics.createMany({ data: userStatistics });
  await prisma.sale.createMany({ data: sales });

  // const users = await getUserFromMlm();
  // const statistics = await getStatisticsFromMlm();
  // const sales = await getSales();
  // const userStatistics = await getUserStatisticsFromMlm();

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
