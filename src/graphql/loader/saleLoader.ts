import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Member } from '@/entity/member/member.entity';
import { Package } from '@/entity/package/package.entity';
import { StatisticsSale } from '@/entity/statisticsSale/statisticsSale.entity';

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

export const packageForSaleLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Package>(
    async (salesIds: string[]) => {
      const packagesWithMembers = await parent.prisma.sale.findMany({
        select: {
          id: true,
          package: true,
        },
        where: { id: { in: salesIds } },
      });

      const packagesWithMembersMap: Record<string, Package> = {};
      packagesWithMembers.forEach(({ id, package: pkg }) => {
        packagesWithMembersMap[id] = pkg;
      });

      return salesIds.map((id) => packagesWithMembersMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const statisticsSalesForSaleLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, StatisticsSale[]>(
    async (saleIds: string[]) => {
      const salesWithStatisticsSales = await parent.prisma.sale.findMany({
        select: {
          id: true,
          statisticsSales: true,
        },
        where: { id: { in: saleIds } },
      });

      const salesWithStatisticsSalesMap: Record<string, StatisticsSale[]> = {};
      salesWithStatisticsSales.forEach(({ id, statisticsSales }) => {
        salesWithStatisticsSalesMap[id] = statisticsSales.map((memberStatistic) => memberStatistic);
      });

      return saleIds.map((id) => salesWithStatisticsSalesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
