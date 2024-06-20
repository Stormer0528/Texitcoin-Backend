import { Prisma, PrismaClient } from '@prisma/client';
import { statisticsData } from './statistics';
import { saleData } from './sale';
import { userData } from './user';
import { userStatisticsData } from './userStatistics';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await prisma.statistics.createMany({ data: statisticsData });
  await prisma.user.createMany({ data: userData });
  await prisma.userStatistics.createMany({ data: userStatisticsData });
  await prisma.sale.createMany({ data: saleData });

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
