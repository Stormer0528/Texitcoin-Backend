import { Service } from 'typedi';
import { Arg, Args, Resolver, Query, Mutation, Info, Authorized } from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';

import { Statistics } from './statistics.entity';
import {
  StatisticsResponse,
  StatisticsQueryArgs,
  CreateStatisticsInput,
  StatisticsConfirmResponse,
  StatisticsConfirmResult,
} from './statistics.type';
import { StatisticsService } from './statistics.service';
import { formatDate } from '@/utils/common';
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
    return this.service.createStatistics({ ...data });
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => StatisticsConfirmResponse)
  async confirmStatistics(): Promise<StatisticsConfirmResponse> {
    const today = new Date(formatDate(new Date()));
    const updatedStatistics: Statistics = await this.service.updateStatistics(today);
    const results: StatisticsConfirmResult[] = updatedStatistics.memberStatistics.map(
      ({ member: { txcCold }, txcShared }) => {
        return {
          txcCold,
          txcShared,
        };
      }
    );
    return { results };
  }
}
