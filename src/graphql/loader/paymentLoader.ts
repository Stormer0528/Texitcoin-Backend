import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Sale } from '@/entity/sale/sale.entity';

export const salesForPaymentLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Sale[]>(
    async (paymentIds: string[]) => {
      const paymentsWithSales = await parent.prisma.payment.findMany({
        select: {
          id: true,
          sales: true,
        },
        where: { id: { in: paymentIds } },
      });

      const paymentsWithSalesMap: Record<string, Sale[]> = {};
      paymentsWithSales.forEach(({ id, sales }) => {
        paymentsWithSalesMap[id] = sales;
      });

      return paymentIds.map((id) => paymentsWithSalesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
