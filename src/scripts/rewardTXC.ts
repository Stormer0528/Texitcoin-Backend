import { PrismaClient } from '@prisma/client';

import { processStatistics } from '@/utils/processData';
import { getSales } from '@/utils/connectMlm';
import { formatDate } from '@/utils/common';

const prisma = new PrismaClient();

export const rewardTXC = async () => {
  const { to, totalBlocks, totalHashPower } = await prisma.statistics.findFirst({
    orderBy: { to: 'desc' },
  });

  const [data, sales] = await Promise.all([
    prisma.block.findMany({ where: { createdAt: { gt: to } } }),
    getSales(),
  ]);

  const newBlocks = data.length;

  const statistics = await processStatistics(sales);

  return {
    ...statistics,
    newBlocks,
    totalBlocks: totalBlocks + newBlocks,
    totalHashPower: totalHashPower + statistics.newHashPower,
    issuedAt: formatDate(new Date()),
    from: data[0].createdAt,
    to: data[newBlocks].createdAt,
  };
};
