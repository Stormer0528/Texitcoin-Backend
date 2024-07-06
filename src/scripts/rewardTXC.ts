import { Member, Prisma, PrismaClient, Sale, Statistics } from '@prisma/client';

import { processStatistics } from '../utils/processData';
import dayjs from 'dayjs';
import { getMembers, getSales } from '@/utils/connectMlm';
import Bluebird from 'bluebird';
import { PAYOUTS } from '@/consts';
import { SaleSearchResult } from '@/type';

const prisma = new PrismaClient();

const createStatistic = async (startDate: string, endDate: string, sales: SaleSearchResult[]) => {
  const newBlocks: number = await prisma.block.count({
    where: {
      issuedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  const totalBlocks: number = await prisma.block.count({
    where: {
      issuedAt: {
        lte: endDate,
      },
    },
  });
  const totalHashPower: number = sales.reduce((prev: number, sale: SaleSearchResult) => {
    return prev + sale.package.token;
  }, 0);
  const memberIds: string[] = [];
  const membersWithHashPower: Record<string, number> = {};
  sales.map((sale) => {
    if (!membersWithHashPower[sale.memberId]) {
      membersWithHashPower[sale.memberId] = 0;
      memberIds.push(sale.memberId);
    }
    membersWithHashPower[sale.memberId] = membersWithHashPower[sale.memberId] + sale.package.token;
  });
  const totalMembers: number = memberIds.length;
  const txcShared: number = newBlocks * 254;
  const issuedAt: string = startDate;
  const statistic: Statistics = await prisma.statistics.create({
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

const createMemberStatistics = async (
  statistic: Statistics,
  memberIds: string[],
  membersWithHashPower: Record<string, number>,
  issuedAt: string
) => {
  const totalHashPower: number = statistic.totalHashPower;
  const totalTxcShared: number = statistic.txcShared;

  await prisma.memberStatistics.createMany({
    data: memberIds.map((memberId: string) => {
      const txcShared: number = (totalTxcShared * membersWithHashPower[memberId]) / totalHashPower;
      const hashPower: number = membersWithHashPower[memberId];
      const percent: number = membersWithHashPower[memberId] / totalHashPower;
      const statisticsId: string = statistic.id;
      return {
        txcShared,
        hashPower,
        percent,
        statisticsId,
        issuedAt,
        memberId,
      };
    }),
  });
};

const createStatisticsAndMemberStatistics = async () => {
  console.log('Creating statistics & memberStatistics...');
  console.log('Removing memberStatistics');
  await prisma.memberStatistics.deleteMany({});
  console.log('Removing statistics');
  await prisma.statistics.deleteMany({});

  const now = dayjs();
  for (let iDate = dayjs('2024-01-01'); iDate.isBefore(now); iDate = iDate.add(1, 'day')) {
    const startDate = iDate.startOf('day').toISOString();
    const endDate = iDate.endOf('day').toISOString();
    console.log(`Creating ${iDate.format('YYYY-MM-DD')}...`);
    const sales: SaleSearchResult[] = await prisma.sale.findMany({
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
    console.log(`Finished ${iDate.format('YYYY-MM-DD')}`);
  }
  console.log('Finished creating statistics & memberStatistics');
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
          create: {
            ...member,
            payoutId: PAYOUTS[0],
          },
          update: {
            ...member,
            payoutId: PAYOUTS[0],
          },
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
