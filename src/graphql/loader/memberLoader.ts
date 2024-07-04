import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Sale } from '@/entity/sale/sale.entity';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';
import { Payout } from '@prisma/client';

export const salesForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Sale[]>(
    async (memberIds: string[]) => {
      const membersWithSales = await parent.prisma.member.findMany({
        select: {
          id: true,
          sales: true,
        },
        where: { id: { in: memberIds } },
      });

      const membersWithSalesMap: Record<string, Sale[]> = {};
      membersWithSales.forEach(({ id, sales }) => {
        membersWithSalesMap[id] = sales;
      });

      return memberIds.map((id) => membersWithSalesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const memberStatisticsForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatistics[]>(
    async (memberIds: string[]) => {
      const membersWithMemberStatistics = await parent.prisma.member.findMany({
        select: {
          id: true,
          statistics: true,
        },
        where: { id: { in: memberIds } },
      });

      const membersWithMemberStatisticsMap: Record<string, MemberStatistics[]> = {};
      membersWithMemberStatistics.forEach(({ id, statistics }) => {
        membersWithMemberStatisticsMap[id] = statistics;
      });

      return memberIds.map((id) => membersWithMemberStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const payoutForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Payout>(
    async (memberIds: string[]) => {
      const membersWithPayout = await parent.prisma.member.findMany({
        select: {
          id: true,
          payout: true,
        },
        where: { id: { in: memberIds } },
      });

      const membersWithPayoutMap: Record<string, Payout> = {};
      membersWithPayout.forEach(({ id, payout }) => {
        membersWithPayoutMap[id] = payout;
      });

      return memberIds.map((id) => membersWithPayoutMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
