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
