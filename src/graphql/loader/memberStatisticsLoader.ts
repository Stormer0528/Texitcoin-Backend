import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Member } from '@/entity/member/member.entity';
import { Statistics } from '@/entity/statistics/statistics.entity';
import { MemberStatisticsWallet } from '@/entity/memberStatisticsWallet/memberStatisticsWallet.entity';

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
      const memberStatisticsWithStatistics = await parent.prisma.memberStatistics.findMany({
        select: {
          id: true,
          statistics: true,
        },
        where: { id: { in: memberStatisticsIds } },
      });

      const memberStatisticssWithStatisticsMap: Record<string, Statistics> = {};
      memberStatisticsWithStatistics.forEach(({ id, statistics }) => {
        memberStatisticssWithStatisticsMap[id] = statistics;
      });

      return memberStatisticsIds.map((id) => memberStatisticssWithStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const walletsForMemberStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatisticsWallet[]>(
    async (memberStatisticsIds: string[]) => {
      const memberStatisticsWithWallets = await parent.prisma.memberStatistics.findMany({
        select: {
          id: true,
          memberStatisticsWallets: true,
        },
        where: { id: { in: memberStatisticsIds } },
      });

      const memberStatisticssWithWallets: Record<string, MemberStatisticsWallet[]> = {};
      memberStatisticsWithWallets.forEach(({ id, memberStatisticsWallets }) => {
        memberStatisticssWithWallets[id] = memberStatisticsWallets;
      });

      return memberStatisticsIds.map((id) => memberStatisticssWithWallets[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
