import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';
import { StatisticsSale } from '@/entity/statisticsSale/statisticsSale.entity';

export const memberStatisticsForStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatistics[]>(
    async (statisticsIds: string[]) => {
      const memberStatistics = await parent.prisma.memberStatistics.findMany({
        where: { statisticsId: { in: statisticsIds } },
      });

      const memberStatisticsMap: Record<string, MemberStatistics[]> = {};
      memberStatistics.forEach((memberStatistic) => {
        if (!memberStatisticsMap[memberStatistic.statisticsId])
          memberStatisticsMap[memberStatistic.statisticsId] = [];
        memberStatisticsMap[memberStatistic.statisticsId].push(memberStatistic);
      });

      return statisticsIds.map((id) => memberStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const statisticsSalesForStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, StatisticsSale[]>(
    async (statisticsIds: string[]) => {
      const statisticsSales = await parent.prisma.statisticsSale.findMany({
        where: { statisticsId: { in: statisticsIds } },
      });

      const statisticsSalesMap: Record<string, StatisticsSale[]> = {};
      statisticsSales.forEach((statisticsSale) => {
        if (!statisticsSalesMap[statisticsSale.statisticsId])
          statisticsSalesMap[statisticsSale.statisticsId] = [];
        statisticsSalesMap[statisticsSale.statisticsId].push(statisticsSale);
      });

      return statisticsIds.map((id) => statisticsSalesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
