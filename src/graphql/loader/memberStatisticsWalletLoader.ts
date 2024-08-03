import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';
import { MemberWallet } from '@/entity/memberWallet/memberWallet.entity';

export const memberStatisticForMemberStatisticsWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatistics>(
    async (memberStatisticsWalletIds: string[]) => {
      const memberStatisticsWalletsWithMemberStatistic =
        await parent.prisma.memberStatisticsWallet.findMany({
          select: {
            id: true,
            memberStatistic: true,
          },
          where: { id: { in: memberStatisticsWalletIds } },
        });

      const memberStatisticsWalletsWithMemberStatisticMap: Record<string, MemberStatistics> = {};
      memberStatisticsWalletsWithMemberStatistic.forEach(({ id, memberStatistic }) => {
        memberStatisticsWalletsWithMemberStatistic[id] = memberStatistic;
      });

      return memberStatisticsWalletIds.map(
        (id) => memberStatisticsWalletsWithMemberStatisticMap[id]
      );
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const memberWalletForMemberStatisticsWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberWallet>(
    async (memberStatisticsWalletIds: string[]) => {
      const memberStatisticsWalletsWithMemberWallet =
        await parent.prisma.memberStatisticsWallet.findMany({
          select: {
            id: true,
            memberWallet: true,
          },
          where: { id: { in: memberStatisticsWalletIds } },
        });

      const memberStatisticsWalletsWithMemberWalletMap: Record<string, MemberWallet> = {};
      memberStatisticsWalletsWithMemberWallet.forEach(({ id, memberWallet }) => {
        memberStatisticsWalletsWithMemberWallet[id] = memberWallet;
      });

      return memberStatisticsWalletIds.map((id) => memberStatisticsWalletsWithMemberWalletMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
