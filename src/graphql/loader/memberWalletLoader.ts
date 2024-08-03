import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Member } from '@/entity/member/member.entity';
import { Payout } from '@/entity/payout/payout.entity';
import { MemberStatisticsWallet } from '@/entity/memberStatisticsWallet/memberStatisticsWallet.entity';

export const memberForMemberWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Member>(
    async (memberWalletIds: string[]) => {
      const memberWalletsWithMembers = await parent.prisma.memberWallet.findMany({
        select: {
          id: true,
          member: true,
        },
        where: { id: { in: memberWalletIds } },
      });

      const memberWalletsWithMembersMap: Record<string, Member> = {};
      memberWalletsWithMembers.forEach(({ id, member }) => {
        memberWalletsWithMembersMap[id] = member;
      });

      return memberWalletIds.map((id) => memberWalletsWithMembersMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const payoutForMemberWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Payout>(
    async (memberWalletIds: string[]) => {
      const memberWalletsWithPayouts = await parent.prisma.memberWallet.findMany({
        select: {
          id: true,
          payout: true,
        },
        where: { id: { in: memberWalletIds } },
      });

      const memberWalletsWithPayoutsMap: Record<string, Payout> = {};
      memberWalletsWithPayouts.forEach(({ id, payout }) => {
        memberWalletsWithPayoutsMap[id] = payout;
      });

      return memberWalletIds.map((id) => memberWalletsWithPayoutsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const memberStatisticsWalletsForMemberWalletLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatisticsWallet[]>(
    async (memberWalletIds: string[]) => {
      const memberWalletsWithMemberStatisticsWallets = await parent.prisma.memberWallet.findMany({
        select: {
          id: true,
          memberStatisticsWallets: true,
        },
        where: { id: { in: memberWalletIds } },
      });

      const memberWalletsWithMemberStatisticsWalletsMap: Record<string, MemberStatisticsWallet[]> =
        {};
      memberWalletsWithMemberStatisticsWallets.forEach(({ id, memberStatisticsWallets }) => {
        memberWalletsWithMemberStatisticsWalletsMap[id] = memberStatisticsWallets;
      });

      return memberWalletIds.map((id) => memberWalletsWithMemberStatisticsWalletsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
