import { Member, Prisma, PrismaClient, Sale, Statistics } from '@prisma/client';

import { processStatistics } from '../utils/processData';
import dayjs from 'dayjs';
import { getMembers, getSales } from '@/utils/connectMlm';
import Bluebird from 'bluebird';
import { SaleSearchResult } from '@/type';
import { formatDate } from '@/utils/common';
import { hashPassword } from '@/utils/auth';
import { payoutData } from 'prisma/seed/payout';

const prisma = new PrismaClient();

const createStatistic = async (date: Date, sales: SaleSearchResult[]) => {
  const totalBlocks: number = await prisma.block.count({
    where: {
      issuedAt: {
        lte: date,
      },
    },
  });

  const {
    _min: { createdAt: from },
    _max: { createdAt: to },
    _count: newBlocks,
  } = await prisma.block.aggregate({
    _min: {
      createdAt: true,
    },
    _max: {
      createdAt: true,
    },
    _count: true,
    where: {
      issuedAt: date,
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
  const issuedAt: Date = date;
  const statistic: Statistics = await prisma.statistics.create({
    data: {
      newBlocks,
      totalBlocks,
      totalHashPower,
      totalMembers,
      status: false,
      txcShared,
      issuedAt,
      from: from || date,
      to: to || date,
    },
  });
  return {
    statistic,
    memberIds,
    membersWithHashPower,
  };
};

const createMemberStatisticsAndStatisticsWallets = async (
  statistic: Statistics,
  memberIds: string[],
  membersWithHashPower: Record<string, number>,
  issuedAt: Date
) => {
  const totalHashPower: number = statistic.totalHashPower;
  const totalTxcShared: number = statistic.txcShared;

  await Bluebird.map(
    memberIds,
    async (memberId: string) => {
      const txcShared: number = (totalTxcShared * membersWithHashPower[memberId]) / totalHashPower;
      const hashPower: number = membersWithHashPower[memberId];
      const percent: number = membersWithHashPower[memberId] / totalHashPower;
      const statisticsId: string = statistic.id;
      const memberStatistic = await prisma.memberStatistics.create({
        data: {
          txcShared,
          hashPower,
          percent,
          statisticsId,
          issuedAt,
          memberId,
        },
      });

      const memberWallets = await prisma.memberWallet.findMany({
        where: {
          memberId: memberId,
          deletedAt: null,
        },
      });

      const memberStatisticsWalletData: Prisma.MemberStatisticsWalletUncheckedCreateInput[] =
        memberWallets.map((wallet) => {
          return {
            memberStatisticId: memberStatistic.id,
            memberWalletId: wallet.id,
            txc: (memberStatistic.txcShared * wallet.percent) / 100,
          };
        });

      await prisma.memberStatisticsWallet.createMany({
        data: memberStatisticsWalletData,
      });
    },
    { concurrency: 10 }
  );
};
const createStatisticSales = async (
  statistic: Statistics,
  sales: SaleSearchResult[],
  issuedAt: Date
) => {
  await prisma.statisticsSale.createMany({
    data: sales.map((sale: SaleSearchResult) => {
      return {
        saleId: sale.id,
        statisticsId: statistic.id,
        issuedAt,
      };
    }),
  });
};

const createStatisticsAndMemberStatistics = async () => {
  console.log('Creating statistics & memberStatistics...');

  const now = dayjs();
  for (let iDate = dayjs('2024-04-01'); iDate.isBefore(now); iDate = iDate.add(1, 'day')) {
    const date = new Date(formatDate(iDate.toDate()));
    console.log(`Creating ${iDate.format('YYYY-MM-DD')}...`);
    const sales: SaleSearchResult[] = await prisma.sale.findMany({
      where: {
        orderedAt: {
          lt: new Date(iDate.add(1, 'day').format('YYYY-MM-DD 00:00:00')),
        },
      },
      select: {
        id: true,
        memberId: true,
        package: true,
      },
    });
    const { statistic, memberIds, membersWithHashPower } = await createStatistic(date, sales);
    await createMemberStatisticsAndStatisticsWallets(
      statistic,
      memberIds,
      membersWithHashPower,
      date
    );
    await createStatisticSales(statistic, sales, date);
    console.log(`Finished ${iDate.format('YYYY-MM-DD')}`);
  }
  console.log('Finished creating statistics & memberStatistics');
};

const toMember = (
  complexMember: any,
  hashedPassword: string
): Prisma.MemberUncheckedCreateInput => {
  return {
    assetId: complexMember.assetId,
    email: complexMember.email,
    fullName: complexMember.fullName,
    mobile: complexMember.mobile,
    primaryAddress: complexMember.primaryAddress,
    secondaryAddress: complexMember.secondaryAddress,
    userId: complexMember.userId,
    username: complexMember.username,
    city: complexMember.city,
    password: hashedPassword,
    state: complexMember.state,
    zipCode: complexMember.zipCode,
  };
};

const syncMembers = async () => {
  try {
    console.log('Syncing members...');

    const mlmMembers = await getMembers();
    const hashedPassword = await hashPassword('123456789');
    const members = await Bluebird.map(
      mlmMembers,
      async (member) => {
        const result = await prisma.member.create({
          data: toMember(member, hashedPassword),
        });

        const wallets: Prisma.MemberWalletUncheckedCreateInput[] = [];
        for (const [column, value] of Object.entries(member)) {
          const payout = payoutData.find((pyData) => pyData.name === column);
          if (payout && value && value !== 'NA') {
            wallets.push({
              address: value as string,
              memberId: result.id,
              payoutId: payout.id,
            });
          }
        }

        await prisma.memberWallet.createMany({
          data: wallets.map((wallet) => ({
            ...wallet,
            percent: 100 / wallets.length,
          })),
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

  console.log('Removing statisticsSale');
  await prisma.statisticsSale.deleteMany({});
  console.log('Removing sales');
  await prisma.sale.deleteMany();

  console.log('Removing memberStatisticsWallet');
  await prisma.memberStatisticsWallet.deleteMany({});
  console.log('Removing memberWallet');
  await prisma.memberWallet.deleteMany({});
  console.log('Removing memberStatistics');
  await prisma.memberStatistics.deleteMany({});
  console.log('Removing member');
  await prisma.member.deleteMany({});

  console.log('Removing statistics');
  await prisma.statistics.deleteMany({});
  console.log('Successfully deleted current database.');

  const members = await syncMembers();
  const _sales = await syncSales(members);

  await createStatisticsAndMemberStatistics();

  console.log('Finished rewarding operation');
}

rewardTXC();
