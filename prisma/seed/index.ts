import { PrismaClient } from '@prisma/client';

import { getSales } from '../../src/utils/connectMlm';
import {
  getMemberFromMlm,
  getStatisticsFromMlm,
  getMemberStatisticsFromMlm,
} from '../../src/utils/getMlmData';
import { userData } from './user';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await Promise.all([prisma.sale.deleteMany({}), prisma.member.deleteMany({})]);
  await prisma.user.createMany({ data: userData });
  const [members, statistics] = await Promise.all([getMemberFromMlm(), getStatisticsFromMlm()]);

  await prisma.statistics.createMany({ data: statistics });
  await prisma.member.createMany({ data: members, skipDuplicates: true });

  const [sales, memberStatistics] = await Promise.all([getSales(), getMemberStatisticsFromMlm()]);

  await prisma.sale.createMany({ data: sales });
  await prisma.memberStatistics.createMany({ data: memberStatistics });

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
