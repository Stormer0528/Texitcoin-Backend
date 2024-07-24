// Inspired by Parabol Dataloader implementation
import DataLoader from 'dataloader';

import { PrismaService } from '@/service/prisma';

import * as memberLoader from './memberLoader';
import * as memberStatisticsLoader from './memberStatisticsLoader';
import * as saleLoader from './saleLoader';
import * as statisticsLoader from './statisticsLoader';
import * as packageLoader from './packageLoader';
import * as payoutLoader from './payoutLoader';
import * as statisticsSaleLoader from './StatisticsSaleLoader';

interface LoaderDict {
  [loaderName: string]: DataLoader<any, any>;
}

// Register all loaders
const loaderMakers = {
  ...memberLoader,
  ...memberStatisticsLoader,
  ...saleLoader,
  ...statisticsLoader,
  ...packageLoader,
  ...payoutLoader,
  ...statisticsSaleLoader,
} as const;

type LoaderMakers = typeof loaderMakers;
export type Loaders = keyof LoaderMakers;

type CustomLoaderMakers = typeof loaderMakers;

type CustomLoaders = keyof CustomLoaderMakers;
type Uncustom<T> = T extends (parent: RootDataLoader) => infer U ? U : never;
type TypeFromCustom<T extends CustomLoaders> = Uncustom<CustomLoaderMakers[T]>;

// Use this if you don't need the dataloader to be shareable
export interface DataLoaderInstance {
  get<LoaderName extends Loaders>(loaderName: LoaderName): TypeFromCustom<LoaderName>;
}

/**
 * This is the main dataloader
 */
export default class RootDataLoader implements DataLoaderInstance {
  readonly prisma: PrismaService;

  dataLoaderOptions: DataLoader.Options<any, any>;
  // casted to any because access to the loaders will results in a creation if needed
  loaders: LoaderDict = {} as any;

  constructor(prisma: PrismaService, dataLoaderOptions: DataLoader.Options<any, any> = {}) {
    this.prisma = prisma;
    this.dataLoaderOptions = dataLoaderOptions;
  }

  get<LoaderName extends Loaders>(loaderName: LoaderName): TypeFromCustom<LoaderName> {
    const loader = this.loaders[loaderName];

    if (loader) {
      return loader as TypeFromCustom<LoaderName>;
    }
    const loaderMaker = loaderMakers[loaderName];

    this.loaders[loaderName] = loaderMaker(this);

    return this.loaders[loaderName] as TypeFromCustom<LoaderName>;
  }
}
