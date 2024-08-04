import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Statistics } from '@/entity/statistics/statistics.entity';
import { Sale } from '@/entity/sale/sale.entity';

export const saleForStatisticsSaleLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Sale>(
    async (saleIds: string[]) => {
      const uniqueSaleIds = [...new Set(saleIds)];
      const sales = await parent.prisma.sale.findMany({
        where: { id: { in: uniqueSaleIds } },
      });

      const salesMap: Record<string, Sale> = {};
      sales.forEach((sale) => {
        salesMap[sale.id] = sale;
      });

      return uniqueSaleIds.map((id) => salesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const statisticsForStatisticsSaleLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Statistics>(
    async (statisticsIds: string[]) => {
      const uniqueStatisticsIds = [...new Set(statisticsIds)];
      const statisticsSales = await parent.prisma.statistics.findMany({
        where: { id: { in: uniqueStatisticsIds } },
      });

      const statisticsSalesMap: Record<string, Statistics> = {};
      statisticsSales.forEach((statistics) => {
        statisticsSalesMap[statistics.id] = statistics;
      });

      return uniqueStatisticsIds.map((id) => statisticsSalesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
