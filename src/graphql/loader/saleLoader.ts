import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Member } from '@/entity/member/member.entity';

export const memberForSaleLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Member>(
    async (salesIds: string[]) => {
      const salesWithMembers = await parent.prisma.sale.findMany({
        select: {
          id: true,
          member: true,
        },
        where: { id: { in: salesIds } },
      });

      const salesWithMembersMap: Record<string, Member> = {};
      salesWithMembers.forEach(({ id, member }) => {
        salesWithMembersMap[id] = member;
      });

      return salesIds.map((id) => salesWithMembersMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
