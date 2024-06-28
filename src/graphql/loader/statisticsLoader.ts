import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';

export const memberStatisticsForStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatistics[]>(
    async (memberIds: string[]) => {
      const statisticsWithMemberStatistics = await parent.prisma.member.findMany({
        select: {
          id: true,
          statistics: true,
        },
        where: { id: { in: memberIds } },
      });

      const statisticsWithMemberStatisticsMap: Record<string, MemberStatistics[]> = {};
      statisticsWithMemberStatistics.forEach(({ id, statistics }) => {
        statisticsWithMemberStatisticsMap[id] = statistics.map(
          (memberStatistics) => memberStatistics
        );
      });

      return memberIds.map((id) => statisticsWithMemberStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
