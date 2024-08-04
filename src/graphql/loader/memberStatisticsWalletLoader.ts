import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';
import { MemberWallet } from '@/entity/memberWallet/memberWallet.entity';

export const memberStatisticForMemberStatisticsWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatistics>(
    async (memberStatisticsIds: string[]) => {
      const uniqueMemberStatisticsIds = [...new Set(memberStatisticsIds)];
      const memberStatistics = await parent.prisma.memberStatistics.findMany({
        where: { id: { in: uniqueMemberStatisticsIds } },
      });

      const memberStatisticsMap: Record<string, MemberStatistics> = {};
      memberStatistics.forEach((memberStatistic) => {
        memberStatisticsMap[memberStatistic.id] = memberStatistic;
      });

      return uniqueMemberStatisticsIds.map((id) => memberStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const memberWalletForMemberStatisticsWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberWallet>(
    async (memberWalletIds: string[]) => {
      const uniqueMemberWalletIds = [...new Set(memberWalletIds)];
      const memberWallets = await parent.prisma.memberWallet.findMany({
        where: { id: { in: uniqueMemberWalletIds }, deletedAt: null },
      });

      const memberWalletsMap: Record<string, MemberWallet> = {};
      memberWallets.forEach((memberWallet) => {
        memberWalletsMap[memberWallet.id] = memberWallet;
      });

      return uniqueMemberWalletIds.map((id) => memberWalletsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
