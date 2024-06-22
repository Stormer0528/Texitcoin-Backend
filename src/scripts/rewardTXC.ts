import { PrismaClient } from '@prisma/client';

import { processStatistics } from '../utils/processData';
import { getSales } from '../utils/connectMlm';
import { formatDate } from '../utils/common';
import { getMemberFromMlm, getMemberStatisticsFromMlm } from '../../src/utils/getMlmData';

const prisma = new PrismaClient();

async function rewardTXC() {
  const result = await prisma.statistics.findFirst({
    orderBy: { to: 'desc' },
  });

  const last = result ?? {
    to: new Date('2001-01-01'),
    totalBlocks: 0,
    totalHashPower: 0,
  };

  const [data, sales] = await Promise.all([
    prisma.block.findMany({ where: { createdAt: { gt: last.to } } }),
    getSales(),
  ]);

  const newBlocks = data.length;

  const statistics = await processStatistics(sales);

  if (newBlocks !== 0) {
    const result = await Promise.all([
      prisma.statistics.create({
        data: {
          ...statistics,
          newBlocks,
          totalBlocks: last.totalBlocks + newBlocks,
          totalHashPower: last.totalHashPower + statistics.newHashPower,
          issuedAt: new Date(formatDate(new Date())),
          from: newBlocks === 0 ? new Date() : data[0].createdAt,
          to: newBlocks === 0 ? new Date() : data[newBlocks - 1].createdAt,
        },
      }),
    ]);

    return result;
  }
}

rewardTXC()
  .then(async () => {
    console.log('creating members');

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
  .catch((err) => console.log('error => ', err));
