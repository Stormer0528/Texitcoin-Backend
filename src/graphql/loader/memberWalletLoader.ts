import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Member } from '@/entity/member/member.entity';
import { Payout } from '@/entity/payout/payout.entity';
import { MemberStatisticsWallet } from '@/entity/memberStatisticsWallet/memberStatisticsWallet.entity';

export const memberForMemberWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Member>(
    async (memberIds: string[]) => {
      const uniqueMemberIds = [...new Set(memberIds)];
      const members = await parent.prisma.member.findMany({
        where: { id: { in: uniqueMemberIds } },
      });

      const membersMap: Record<string, Member> = {};
      members.forEach((member) => {
        membersMap[member.id] = member;
      });

      return uniqueMemberIds.map((id) => membersMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const payoutForMemberWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Payout>(
    async (payoutIds: string[]) => {
      const uniquePayoutIds = [...new Set(payoutIds)];
      const payouts = await parent.prisma.payout.findMany({
        where: { id: { in: uniquePayoutIds } },
      });

      const payoutsMap: Record<string, Payout> = {};
      payouts.forEach((payout) => {
        payoutsMap[payout.id] = payout;
      });

      return uniquePayoutIds.map((id) => payoutsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const memberStatisticsWalletsForMemberWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatisticsWallet[]>(
    async (memberWalletIds: string[]) => {
      const memberStatisticsWallets = await parent.prisma.memberStatisticsWallet.findMany({
        where: { memberWalletId: { in: memberWalletIds } },
      });

      const memberStatisticsWalletsMap: Record<string, MemberStatisticsWallet[]> = {};
      memberStatisticsWallets.forEach((memberStatisticsWallet) => {
        if (!memberStatisticsWalletsMap[memberStatisticsWallet.memberWalletId])
          memberStatisticsWalletsMap[memberStatisticsWallet.memberWalletId] = [];
        memberStatisticsWalletsMap[memberStatisticsWallet.memberWalletId].push(
          memberStatisticsWallet
        );
      });

      return memberWalletIds.map((id) => memberStatisticsWalletsMap[id] ?? []);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
