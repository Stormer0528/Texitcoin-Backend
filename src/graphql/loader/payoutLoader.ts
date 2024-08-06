import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { MemberWallet } from '@/entity/memberWallet/memberWallet.entity';

export const memberWalletsForPayoutLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberWallet[]>(
    async (payoutIds: string[]) => {
      const memberWallets = await parent.prisma.memberWallet.findMany({
        where: { payoutId: { in: payoutIds }, deletedAt: null },
      });

      const memberWalletsMap: Record<string, MemberWallet[]> = {};
      memberWallets.forEach((memberWallet) => {
        if (!memberWalletsMap[memberWallet.payoutId]) memberWalletsMap[memberWallet.payoutId] = [];
        memberWalletsMap[memberWallet.payoutId].push(memberWallet);
      });

      return payoutIds.map((id) => memberWalletsMap[id] ?? []);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
