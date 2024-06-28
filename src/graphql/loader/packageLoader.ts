import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Sale } from '@/entity/sale/sale.entity';

export const salesForPackageLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Sale[]>(
    async (packageIds: string[]) => {
      const packagesWithSales = await parent.prisma.package.findMany({
        select: {
          id: true,
          sales: true,
        },
        where: { id: { in: packageIds } },
      });

      const packagesWithSalesMap: Record<string, Sale[]> = {};
      packagesWithSales.forEach(({ id, sales }) => {
        packagesWithSalesMap[id] = sales;
      });

      return packageIds.map((id) => packagesWithSalesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
