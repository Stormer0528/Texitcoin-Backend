import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';

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
