import { Service } from 'typedi';
import { Arg, Args, Resolver, Query, Mutation, Info, Authorized } from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';
import { User } from '@/entity/user/user.entity';

import { UserStatistics } from './userStatistics.entity';
import {
  UserStatisticsResponse,
  UserStatisticsQueryArgs,
  CreateUserStatisticsInput,
} from './userStatistics.type';
import { UserStatisticsService } from './userStatistics.srevice';

@Service()
@Resolver(() => UserStatistics)
export class UserStatisticsResolver {
  constructor(private readonly service: UserStatisticsService) {}

  @Query(() => UserStatisticsResponse)
  async userStatistics(
    @Args() query: UserStatisticsQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<UserStatisticsResponse> {
    const { where, ...rest } = query;
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; userStatistics?: any } = {};

    if ('total' in fields) {
      promises.total = this.service.getUserStatisticsCount(query);
    }

    if ('userStatistics' in fields) {
      promises.userStatistics = this.service.getUserStatistics(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; userStatistics?: UserStatistics[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => UserStatistics)
  async createUserStatistics(
    @Arg('data') data: CreateUserStatisticsInput
  ): Promise<UserStatistics> {
    return this.service.createUserStatistics({ ...data });
  }
}
