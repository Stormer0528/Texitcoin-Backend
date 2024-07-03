import { PrismaClient, Sale, Statistics } from '@prisma/client';

import { processStatistics } from '../utils/processData';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

const createStatistics = async (sales: Sale[]) => {
  try {
    const latestReward = (await prisma.statistics.findFirst({
      orderBy: { to: 'desc' },
    })) ?? {
      to: new Date(process.env.LAST_MANUAL_REWARD_TIMESTAMP),
      totalBlocks: +process.env.LAST_MANUAL_REWARD_BLOCK,
      totalHashPower: 0,
    };

    console.log(`Last reward block: ${latestReward.totalBlocks}`);
    console.log(`Last reward date: ${latestReward.to}`);

    const newBlocks = await prisma.block.findMany({
      where: { createdAt: { gt: latestReward.to }, blockNo: { gt: latestReward.totalBlocks } },
      orderBy: { blockNo: 'desc' },
    });

    if (newBlocks.length) {
      console.log(`New blocks since last reward: ${newBlocks.length}`);
      console.log(`Current block to reward: ${newBlocks[0].blockNo}`);

      const statistics = await processStatistics(sales);
      const newReward = await prisma.statistics.create({
        data: {
          ...statistics,
          newBlocks: newBlocks.length,
          totalBlocks: latestReward.totalBlocks + newBlocks.length,
          issuedAt: dayjs(new Date()).format('YYYY-MM-DD 00:00:00'),
          from: newBlocks[newBlocks.length - 1].createdAt,
          to: newBlocks[0].createdAt,
        },
      });

      console.log('Successfully created statistics');

      return newReward;
    } else {
      console.log('No new blocks since last reward, skipping statistics creation.');
      return null;
    }
  } catch (err) {
    console.log('error => ', err);
  }
};

async function rewardTXC() {
  console.log('Started rewarding operation');

  const sales = await prisma.sale.findMany();
  await createStatistics(sales);

  console.log('Finished rewarding operation');
}

rewardTXC();
