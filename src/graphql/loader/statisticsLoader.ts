import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';
import { StatisticsSale } from '@/entity/statisticsSale/statisticsSale.entity';

export const memberStatisticsForStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatistics[]>(
    async (statisticsIds: string[]) => {
      const statisticsWithMemberStatistics = await parent.prisma.statistics.findMany({
        select: {
          id: true,
          memberStatistics: true,
        },
        where: { id: { in: statisticsIds } },
      });

      const statisticsWithMemberStatisticsMap: Record<string, MemberStatistics[]> = {};
      statisticsWithMemberStatistics.forEach(({ id, memberStatistics }) => {
        statisticsWithMemberStatisticsMap[id] = memberStatistics.map(
          (memberStatistic) => memberStatistic
        );
      });

      return statisticsIds.map((id) => statisticsWithMemberStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const statisticsSalesForStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, StatisticsSale[]>(
    async (statisticsIds: string[]) => {
      const statisticsWithStatisticsSales = await parent.prisma.statistics.findMany({
        select: {
          id: true,
          statisticsSales: true,
        },
        where: { id: { in: statisticsIds } },
      });

      const statisticsWithStatisticsSalesMap: Record<string, StatisticsSale[]> = {};
      statisticsWithStatisticsSales.forEach(({ id, statisticsSales }) => {
        statisticsWithStatisticsSalesMap[id] = statisticsSales.map(
          (memberStatistic) => memberStatistic
        );
      });

      return statisticsIds.map((id) => statisticsWithStatisticsSalesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
