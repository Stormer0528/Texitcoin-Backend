import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Member } from '@/entity/member/member.entity';
import { Statistics } from '@/entity/statistics/statistics.entity';
import { MemberStatisticsWallet } from '@/entity/memberStatisticsWallet/memberStatisticsWallet.entity';

export const memberForMemberStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Member>(
    async (memberIds: string[]) => {
      const uniqueMemberIds = [...new Set(memberIds)];
      const members = await parent.prisma.member.findMany({
        where: { id: { in: uniqueMemberIds } },
      });

      const memberMap: Record<string, Member> = {};
      members.forEach((member) => {
        memberMap[member.id] = member;
      });

      return uniqueMemberIds.map((id) => memberMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const statisticsForMemberStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Statistics>(
    async (statisticsIds: string[]) => {
      const uniqueStatisticsIds = [...new Set(statisticsIds)];
      const statistics = await parent.prisma.statistics.findMany({
        where: { id: { in: uniqueStatisticsIds } },
      });

      const statisticsMap: Record<string, Statistics> = {};
      statistics.forEach((statistic) => {
        statisticsMap[statistic.id] = statistic;
      });

      return uniqueStatisticsIds.map((id) => statisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const walletsForMemberStatisticsLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatisticsWallet[]>(
    async (memberStatisticsIds: string[]) => {
      const memberStatisticsWallets = await parent.prisma.memberStatisticsWallet.findMany({
        where: { memberStatisticId: { in: memberStatisticsIds } },
      });

      const memberStatisticsWalletsMap: Record<string, MemberStatisticsWallet[]> = {};
      memberStatisticsWallets.forEach((memberStatisticWallet) => {
        if (!memberStatisticsWalletsMap[memberStatisticWallet.memberStatisticId])
          memberStatisticsWalletsMap[memberStatisticWallet.memberStatisticId] = [];
        memberStatisticsWalletsMap[memberStatisticWallet.memberStatisticId].push(
          memberStatisticWallet
        );
      });

      return memberStatisticsIds.map((id) => memberStatisticsWalletsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
