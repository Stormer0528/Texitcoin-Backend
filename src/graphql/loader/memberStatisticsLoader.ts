import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Member } from '@/entity/member/member.entity';
import { Statistics } from '@/entity/statistics/statistics.entity';

export const memberForMemberStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Member>(
    async (memberStatisticsIds: string[]) => {
      const memberStaticsWithMembers = await parent.prisma.memberStatistics.findMany({
        select: {
          id: true,
          member: true,
        },
        where: { id: { in: memberStatisticsIds } },
      });

      const memberStaticsWithMembersMap: Record<string, Member> = {};
      memberStaticsWithMembers.forEach(({ id, member }) => {
        memberStaticsWithMembersMap[id] = member;
      });

      return memberStatisticsIds.map((id) => memberStaticsWithMembersMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const statisticsForMemberStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Statistics>(
    async (memberStatisticsIds: string[]) => {
      const membersWithMemberStatistics = await parent.prisma.memberStatistics.findMany({
        select: {
          id: true,
          statistics: true,
        },
        where: { id: { in: memberStatisticsIds } },
      });

      const memberStatisticssWithStatisticsMap: Record<string, Statistics> = {};
      membersWithMemberStatistics.forEach(({ id, statistics }) => {
        memberStatisticssWithStatisticsMap[id] = statistics;
      });

      return memberStatisticsIds.map((id) => memberStatisticssWithStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
