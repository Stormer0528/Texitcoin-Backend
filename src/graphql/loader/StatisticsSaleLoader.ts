import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Member } from '@/entity/member/member.entity';
import { Statistics } from '@/entity/statistics/statistics.entity';
import { Sale } from '@/entity/sale/sale.entity';

export const saleForStatisticsSaleLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Sale>(
    async (statisticsSaleIds: string[]) => {
      const statisticsSaleWithsales = await parent.prisma.statisticsSale.findMany({
        select: {
          id: true,
          sale: true,
        },
        where: { id: { in: statisticsSaleIds } },
      });

      const memberStaticsWithsalesMap: Record<string, Sale> = {};
      statisticsSaleWithsales.forEach(({ id, sale }) => {
        memberStaticsWithsalesMap[id] = sale;
      });

      return statisticsSaleIds.map((id) => memberStaticsWithsalesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const statisticsForStatisticsSaleLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Statistics>(
    async (statisticsSaleIds: string[]) => {
      const membersWithStatisticsSale = await parent.prisma.statisticsSale.findMany({
        select: {
          id: true,
          statistics: true,
        },
        where: { id: { in: statisticsSaleIds } },
      });

      const statisticsSalesWithStatisticsMap: Record<string, Statistics> = {};
      membersWithStatisticsSale.forEach(({ id, statistics }) => {
        statisticsSalesWithStatisticsMap[id] = statistics;
      });

      return statisticsSaleIds.map((id) => statisticsSalesWithStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
