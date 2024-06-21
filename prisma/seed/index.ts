import { PrismaClient } from '@prisma/client';

import { userData } from './user';
import { getMemberFromMlm, getMemberStatisticsFromMlm } from '../../src/utils/getMlmData';
import { getSales } from '../../src/utils/connectMlm';
import { syncBlocks } from '../../src/scripts/syncBlocks';
import { rewardTXC } from '../../src/scripts/rewardTXC';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  console.log('creating block');

  await syncBlocks();
  await rewardTXC();
}

main()
  .then(async () => {
    console.log('creating users');

    await prisma.user.createMany({ data: userData, skipDuplicates: true });

    const [members] = await Promise.all([getMemberFromMlm()]);

    await Promise.all(
      members.map(async (member) => {
        const result = await prisma.member.upsert({
          where: { userId: member.userId },
          create: member,
          update: member,
        });

        return result;
      })
    );
  })
  .then(async () => {
    console.log('creating sales');

    const [sales] = await Promise.all([getSales(), await prisma.sale.deleteMany()]);

    await prisma.sale.createMany({ data: sales });

    console.log(`Seeding finished.`);
  })
  .then(async () => {
    console.log('creating memberStatistics');

    const [memberStatistics] = await Promise.all([getMemberStatisticsFromMlm()]);

    await prisma.memberStatistics.createMany({ data: memberStatistics });

    console.log('Finished seed');
  })
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
