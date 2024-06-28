import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Sale } from '@/entity/sale/sale.entity';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';

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
        membersWithMemberStatisticsMap[id] = statistics.map((memberStatistics) => memberStatistics);
      });

      return memberIds.map((id) => membersWithMemberStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
