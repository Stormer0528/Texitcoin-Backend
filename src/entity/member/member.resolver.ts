import { Service } from 'typedi';
import { Arg, Args, Resolver, Query, Mutation, Authorized, Ctx, Info } from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { type Context } from '@/context';
import { GroupedByCreatedAt, UserRole } from '@/type';
import { hashPassword } from '@/utils/auth';

import { Member } from './member.entity';
import {
  MembersResponse,
  MemberQueryArgs,
  CreateMemberInput,
  UpdateMemberInput,
  MemberIncreaseRate,
  MemberIncreaseRatesResponse,
} from './member.type';
import { MemberService } from './member.service';

@Service()
@Resolver(() => Member)
export class MemberResolver {
  constructor(private readonly service: MemberService) {}

  @Authorized()
  @Query(() => MembersResponse)
  async fetchMembers(
    @Args() query: MemberQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<MembersResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; members?: Promise<Member[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getMembersCount(query);
    }

    if ('members' in fields) {
      promises.members = this.service.getMembers(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; members?: Member[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized()
  @Query(() => MemberIncreaseRatesResponse)
  async fetchMembersGroupByDate(
    @Args() query: MemberQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<MemberIncreaseRatesResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; rates?: Promise<MemberIncreaseRate[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getGroupsCountByDate(query);
    }

    if ('rates' in fields) {
      promises.rates = this.service
        .getMembersGroupByDate(query)
        .then((totalGroups: GroupedByCreatedAt[]) =>
          totalGroups.map(({ createdAt, _count: { _all: count } }: GroupedByCreatedAt) => {
            return { date: createdAt.toISOString().split('T')[0], count };
          })
        );
    }

    const result = await Promise.all(Object.entries(promises));

    let response: MemberIncreaseRatesResponse = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized()
  @Query(() => Number)
  async count(@Ctx() ctx: Context): Promise<Number> {
    return this.service.getMembersCount({ orderBy: {}, parsePage: {}, where: {} });
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Member)
  async createMember(@Arg('data') data: CreateMemberInput): Promise<Member> {
    // Hash the password
    const hashedPassword = await hashPassword('123456789');
    return this.service.createMember({ ...data, password: hashedPassword });
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Member)
  async updateMember(@Arg('data') data: UpdateMemberInput): Promise<Member> {
    return this.service.updateMember(data);
  }
}
