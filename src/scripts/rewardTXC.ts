import { PrismaClient } from '@prisma/client';

import { processStatistics } from '../utils/processData';
import { getSales } from '../utils/connectMlm';
import { formatDate } from '../utils/common';

const prisma = new PrismaClient();

export const rewardTXC = async () => {
  const result = await prisma.statistics.findFirst({
    orderBy: { to: 'desc' },
  });

  const last = result
    ? result
    : {
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
};
