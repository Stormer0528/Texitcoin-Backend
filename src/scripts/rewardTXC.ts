import { Member, Prisma, PrismaClient, Sale, Statistics } from '@prisma/client';

import { processStatistics } from '../utils/processData';
import dayjs from 'dayjs';
import { getMembers, getSales } from '@/utils/connectMlm';
import Bluebird from 'bluebird';

const prisma = new PrismaClient();

const createStatistic = async (startDate, endDate, sales) => {
  const newBlocks = await prisma.block.count({
    where: {
      issuedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  const totalBlocks = await prisma.block.count({
    where: {
      issuedAt: {
        lte: endDate,
      },
    },
  });
  const totalHashPower = sales.reduce((prev, sale) => {
    return prev + sale.package.token;
  }, 0);
  const memberIds = [];
  const membersWithHashPower = {};
  sales.map((sale) => {
    if (!membersWithHashPower[sale.memberId]) {
      membersWithHashPower[sale.memberId] = 0;
    }
    membersWithHashPower[sale.memberId] = membersWithHashPower[sale.memberId] + sale.package.token;
  });
  const totalMembers = memberIds.length;
  const txcShared = newBlocks * 254;
  const issuedAt = startDate;
  const statistic = await prisma.statistics.create({
    data: {
      newBlocks,
      totalBlocks,
      totalHashPower,
      totalMembers,
      status: true,
      txcShared,
      issuedAt,
      from: startDate,
      to: endDate,
    },
  });
  return {
    statistic,
    memberIds,
    membersWithHashPower,
  };
};

const createMemberStatistics = async (statistic, memberIds, membersWithHashPower, issuedAt) => {
  const totalHashPower = statistic.totalHashPower;
  const totalTxcShared = statistic.txcShared;
  await prisma.memberStatistics.createMany(
    memberIds.map((memberId) => {
      const txcShared = (totalTxcShared * membersWithHashPower[memberId]) / totalHashPower;
      const hashPower = membersWithHashPower[memberId];
      const percent = membersWithHashPower[memberId] / totalHashPower;
      const statisticsId = statistic.id;
      return {
        txcShared,
        hashPower,
        percent,
        statisticsId,
        issuedAt,
      };
    })
  );
};

const createStatisticsAndMemberStatistics = async () => {
  const now = dayjs();
  for (const iDate = dayjs('2024-04-01'); iDate.isBefore(now); iDate.add(1, 'day')) {
    const startDate = iDate.startOf('day').toDate();
    const endDate = iDate.endOf('day').toDate();
    const sales = await prisma.sale.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        memberId: true,
        package: true,
      },
    });
    const { statistic, memberIds, membersWithHashPower } = await createStatistic(
      startDate,
      endDate,
      sales
    );
    await createMemberStatistics(statistic, memberIds, membersWithHashPower, startDate);
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

async function rewardTXC() {
  console.log('Started rewarding operation');

  const members = await syncMembers();
  const _sales = await syncSales(members);

  await createStatisticsAndMemberStatistics();

  console.log('Finished rewarding operation');
}

rewardTXC();
