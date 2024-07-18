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

import { MemberStatistics } from './memberStatistics.entity';
import {
  MemberStatisticsResponse,
  MemberStatisticsQueryArgs,
  CreateMemberStatisticsInput,
  MemberOverview,
  MemberOverviewInput,
  CreateManyMemberStatisticsInput,
} from './memberStatistics.type';
import { MemberStatisticsService } from './memberStatistics.service';
import { Member } from '../member/member.entity';
import { Context } from '@/context';
import { Statistics } from '../statistics/statistics.entity';
import { MemberService } from '../member/member.service';
import { IDInput, IDsInput, ManySuccessResponse } from '../common/common.type';

@Service()
@Resolver(() => MemberStatistics)
export class MemberStatisticsResolver {
  constructor(
    private readonly service: MemberStatisticsService,
    private readonly memberService: MemberService
  ) {}

  @Query(() => MemberStatisticsResponse)
  async memberStatistics(
    @Args() query: MemberStatisticsQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<MemberStatisticsResponse> {
    const { where, ...rest } = query;
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; memberStatistics?: any } = {};

    if ('total' in fields) {
      promises.total = this.service.getMemberStatisticsCount(query);
    }

    if ('memberStatistics' in fields) {
      promises.memberStatistics = this.service.getMemberStatistics(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; memberStatistics?: MemberStatistics[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => MemberStatistics)
  async createMemberStatistics(
    @Arg('data') data: CreateMemberStatisticsInput
  ): Promise<MemberStatistics> {
    return this.service.createMemberStatistics(data);
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => ManySuccessResponse)
  async createManyMemberStatistics(
    @Arg('data') data: CreateManyMemberStatisticsInput
  ): Promise<ManySuccessResponse> {
    try {
      const { count } = await this.service.createManyMemberStatistics(data);
      return { count };
    } catch (err) {
      return { count: 0 };
    }
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => ManySuccessResponse)
  async removeManyMemberStatistics(@Arg('data') data: IDsInput): Promise<ManySuccessResponse> {
    try {
      const { count } = await this.service.removeManyMemberStatistics(data);
      return { count };
    } catch (err) {
      return { count: 0 };
    }
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => ManySuccessResponse)
  async removeMemberStatisticsByStaitisId(
    @Arg('data') data: IDInput
  ): Promise<ManySuccessResponse> {
    try {
      const { count } = await this.service.removeMemberStatisticsByStatisticId(data);
      return { count };
    } catch (err) {
      return { count: 0 };
    }
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async member(@Root() memberStatistics: MemberStatistics, @Ctx() ctx: Context): Promise<Member> {
    return ctx.dataLoader.get('memberForMemberStatisticsLoader').load(memberStatistics.id);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async statistics(
    @Root() memberStatistics: MemberStatistics,
    @Ctx() ctx: Context
  ): Promise<Statistics> {
    return ctx.dataLoader.get('statisticsForMemberStatisticsLoader').load(memberStatistics.id);
  }

  @Authorized([UserRole.Admin])
  @Query(() => MemberOverview)
  async memberOverview(@Arg('data') { id }: MemberOverviewInput): Promise<MemberOverview> {
    const { txcShared: totalTXCShared } = await this.service.getTotalTXCShared(id);
    const { hashPower: lastHashPower } = await this.service.getMemberStatistic({
      where: {
        memberId: id,
      },
      select: {
        hashPower: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
    const { createdAt: joinDate } = await this.memberService.getMemberById(id);

    return {
      lastHashPower,
      totalTXCShared,
      joinDate,
    };
  }
}
