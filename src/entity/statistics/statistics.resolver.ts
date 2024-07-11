import { Service } from 'typedi';
import {
  Arg,
  Args,
  Resolver,
  Query,
  Mutation,
  Info,
  Authorized,
  FieldResolver,
  Root,
  Ctx,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';

import { Statistics } from './statistics.entity';
import {
  StatisticsResponse,
  StatisticsQueryArgs,
  CreateStatisticsInput,
  PendingStatisticsResponse,
  PendingStatistics,
  UpdateStatisticsInput,
} from './statistics.type';
import { StatisticsService } from './statistics.service';
import { formatDate, today } from '@/utils/common';
import { Context } from '@/context';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';
import { BlockService } from '../block/block.service';
import dayjs from 'dayjs';
import { StatisticsSale } from '../statisticsSale/statisticsSale.entity';

@Service()
@Resolver(() => Statistics)
export class StatisticsResolver {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly blockService: BlockService
  ) {}

  @Query(() => StatisticsResponse)
  async statistics(
    @Args() query: StatisticsQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<StatisticsResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; statistics?: Promise<Statistics[]> } = {};

    if ('total' in fields) {
      promises.total = this.statisticsService.getStatisticsCount(query);
    }

    if ('statistics' in fields) {
      promises.statistics = this.statisticsService.getStatistics(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; statistics?: Statistics[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Statistics)
  async createStatistics(@Arg('data') data: CreateStatisticsInput): Promise<Statistics> {
    if (data.id) {
      return this.statisticsService.updateStatisticsWholeById(data.id, data);
    }

    const statistic = await this.statisticsService.getLastStatistic();
    const lastDate = statistic ? statistic.to : new Date('2024-04-01');
    const { from, to, count } = await this.blockService.getBlockDataRange({
      createdAt: { gt: lastDate },
    });

    const now = new Date();
    const issuedAt = new Date(formatDate(to || now));

    const totalBlocks = (statistic?.totalBlocks || 0) + count;
    const status = false;
    const txcShared = count * 254;

    const payload = {
      newBlocks: count,
      totalBlocks,
      status,
      txcShared,
      issuedAt,
      from: from || new Date(formatDate(now)),
      to: to || now,
      ...data,
    };

    return this.statisticsService.createStatistics(payload);
  }

  @Query(() => PendingStatisticsResponse)
  async pendingStatistics(
    @Args() query: StatisticsQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<PendingStatisticsResponse> {
    const pendingStatistics: Statistics = await this.statisticsService.getPendingStatistics(
      query,
      today()
    );

    const results: PendingStatistics[] = pendingStatistics.memberStatistics.map(
      ({ member: { wallet }, txcShared }) => {
        return {
          wallet,
          txcShared,
        };
      }
    );

    return { results };
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Statistics)
  async updateStatistics(@Arg('data') data: UpdateStatisticsInput): Promise<Statistics> {
    return await this.statisticsService.updateStatistics(data);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async memberStatistics(
    @Root() statistics: Statistics,
    @Ctx() ctx: Context
  ): Promise<MemberStatistics[]> {
    return ctx.dataLoader.get('memberStatisticsForStatisticsLoader').load(statistics.id);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async statisticsSales(
    @Root() statistics: Statistics,
    @Ctx() ctx: Context
  ): Promise<StatisticsSale[]> {
    return ctx.dataLoader.get('statisticsSalesForStatisticsLoader').load(statistics.id);
  }
}
