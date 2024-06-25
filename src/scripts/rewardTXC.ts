import { Member, PrismaClient, Sale, Statistics } from '@prisma/client';
import Bluebird from 'bluebird';

import { processStatistics } from '../utils/processData';
import { getSales, getMembers } from '../utils/connectMlm';

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

const syncMembers = async () => {
  try {
    console.log('Syncing members...');

    const mlmMembers = await getMembers();

    const members = await Bluebird.map(
      mlmMembers,
      async (member) => {
        const result = await prisma.member.upsert({
          where: { userId: member.userId },
          create: member,
          update: member,
        });

        return result;
      },
      { concurrency: 10 }
    );

    console.log(`Successfully synced ${members.length} members`);

    return members;
  } catch (err) {
    console.log('error => ', err);
  }
};

const syncSales = async (members: Member[]) => {
  try {
    console.log('Syncing sales...');

    await prisma.sale.deleteMany();
    console.log('Successfully deleted current sales.');

    const mlmSales = await getSales(members);

    const sales = await prisma.sale.createManyAndReturn({ data: mlmSales });

    console.log('Successfully created sales');

    return sales;
  } catch (err) {
    console.log('error => ', err);
  }
};

const createMemberStatistics = async (newReward: Statistics, sales: Sale[]) => {
  try {
    console.log('Creating memberStatistics...');

    const hashPowerByMember: Record<string, number> = sales.reduce(
      (prev, { hashPower, memberId }) => ({
        ...prev,
        [memberId]: (prev[memberId] || 0) + hashPower,
      }),
      {}
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

  const members = await syncMembers();
  const sales = await syncSales(members);
  const newReward = await createStatistics(sales);

  if (newReward) {
    await createMemberStatistics(newReward, sales);
  }

  console.log('Finished rewarding operation');
}

rewardTXC();
