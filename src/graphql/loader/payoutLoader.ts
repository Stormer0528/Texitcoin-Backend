import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { MemberWallet } from '@/entity/memberWallet/memberWallet.entity';

export const memberWalletsForPayoutLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberWallet[]>(
    async (payoutIds: string[]) => {
      const payoutsWithMemberWallets = await parent.prisma.payout.findMany({
        select: {
          id: true,
          memberWallets: true,
        },
        where: { id: { in: payoutIds } },
      });

      const payoutsWithMemberWalletsMap: Record<string, MemberWallet[]> = {};
      payoutsWithMemberWallets.forEach(({ id, memberWallets }) => {
        payoutsWithMemberWalletsMap[id] = memberWallets;
      });

      return payoutIds.map((id) => payoutsWithMemberWalletsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
