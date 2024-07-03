import { PrismaClient, Sale, Statistics } from '@prisma/client';

import { processStatistics } from '../utils/processData';

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
          issuedAt: new Date(),
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

const createMemberStatistics = async (newReward: Statistics, sales: Sale[]) => {
  try {
    console.log('Creating memberStatistics...');

    const hashPowerByMember: Record<string, number> = await sales.reduce(
      async (promisePrev, { packageId, memberId }) => {
        const prev = await promisePrev;
        const pkg = await prisma.package.findUnique({
          select: {
            token: true,
          },
          where: {
            id: packageId,
          },
        });
        return {
          ...prev,
          [memberId]: (prev[memberId] || 0) + pkg.token,
        };
      },
      Promise.resolve({})
    );

    const memberStatistics = Object.entries(hashPowerByMember).map(([memberId, hashPower]) => ({
      memberId: memberId,
      statisticsId: newReward.id,
      issuedAt: newReward.issuedAt,
      txcShared: Number(
        ((newReward.newBlocks * hashPower * 254) / newReward.totalHashPower).toFixed(6)
      ),
      hashPower,
      percent: Number(((hashPower * 100) / newReward.totalHashPower).toFixed(3)),
    }));

    const result = await prisma.memberStatistics.createMany({ data: memberStatistics });

    console.log(`Successfully created ${result.count} memberStatistics`);
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
