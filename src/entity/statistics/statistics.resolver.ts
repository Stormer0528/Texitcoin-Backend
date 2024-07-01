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
  ConfirmStatistics,
  PendingStatisticsResponse,
  PendingStatistics,
  Status,
} from './statistics.type';
import { StatisticsService } from './statistics.service';
import { today } from '@/utils/common';
import { Context } from '@/context';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';

@Service()
@Resolver(() => Statistics)
export class StatisticsResolver {
  constructor(private readonly service: StatisticsService) {}

  @Query(() => StatisticsResponse)
  async statistics(
    @Args() query: StatisticsQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<StatisticsResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; statistics?: Promise<Statistics[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getStatisticsCount(query);
    }

    if ('statistics' in fields) {
      promises.statistics = this.service.getStatistics(query);
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
    return this.service.createStatistics(data);
  }

  @Query(() => PendingStatisticsResponse)
  async pendingStatistics(
    @Args() query: StatisticsQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<PendingStatisticsResponse> {
    const pendingStatistics: Statistics = await this.service.getPendingStatistics(query, today());

    const results: PendingStatistics[] = pendingStatistics.memberStatistics.map(
      ({ member: { txcCold }, txcShared }) => {
        return {
          txcCold,
          txcShared,
        };
      }
    );

    return { results };
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Status)
  async confirmStatistics(@Arg('data') data: ConfirmStatistics): Promise<Status> {
    await this.service.updateStatistics(data);

    return { success: true };
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async memberStatistics(
    @Root() statistics: Statistics,
    @Ctx() ctx: Context
  ): Promise<MemberStatistics[]> {
    return ctx.dataLoader.get('memberStatisticsForStatisticsLoader').load(statistics.id);
  }
}
