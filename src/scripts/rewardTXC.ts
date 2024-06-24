import { PrismaClient } from '@prisma/client';
import Bluebird from 'bluebird';

import { processStatistics } from '../utils/processData';
import { getSales } from '../utils/connectMlm';
import { formatDate } from '../utils/common';
import { getMemberFromMlm, getMemberStatisticsFromMlm } from '../../src/utils/getMlmData';

const prisma = new PrismaClient();

const createStatistics = async () => {
  try {
    const result = await prisma.statistics.findFirst({
      orderBy: { to: 'desc' },
    });

    const last = result ?? {
      to: new Date('2001-01-01'),
      totalBlocks: 0,
      totalHashPower: 0,
    };

    console.log(`last blocks: ${last.totalBlocks}`);
    console.log(`last date: ${last.to}`);

    const [data, sales] = await Promise.all([
      prisma.block.findMany({ where: { createdAt: { gt: last.to } } }),
      getSales(),
    ]);

    const newBlocks = data.length;

    console.log(`new blocks: ${newBlocks}`);

    const statistics = await processStatistics(sales);

    if (newBlocks !== 0) {
      await prisma.statistics.create({
        data: {
          ...statistics,
          newBlocks,
          totalBlocks: last.totalBlocks + newBlocks,
          totalHashPower: last.totalHashPower + statistics.newHashPower,
          issuedAt: new Date(formatDate(new Date())),
          from: newBlocks === 0 ? new Date() : data[0].createdAt,
          to: newBlocks === 0 ? new Date() : data[newBlocks - 1].createdAt,
        },
      });
    }

    console.log('Successfully created statistics');
  } catch (err) {
    console.log('error => ', err);
  }
};

const createMember = async () => {
  try {
    console.log('Creating members');

    const members = await getMemberFromMlm();

    await Bluebird.map(
      members,
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
  } catch (err) {
    console.log('error => ', err);
  }
};

const createSales = async () => {
  try {
    console.log('Creating sales');

    await prisma.sale.deleteMany();
    const sales = await getSales();

    await prisma.sale.createMany({ data: sales });

    console.log('Successfully created sales');
  } catch (err) {
    console.log('error => ', err);
  }
};

const createMemberStatistics = async () => {
  try {
    console.log('Creating memberStatistics');

    const memberStatistics = await getMemberStatisticsFromMlm();

    await prisma.memberStatistics.createMany({ data: memberStatistics });
  } catch (err) {
    console.log('error => ', err);
  }
};

async function rewardTXC() {
  console.log('Start database operation');

  await createStatistics();
  await createMember();
  await createSales();
  await createMemberStatistics();

  console.log('Finished database operation');
}

rewardTXC();
