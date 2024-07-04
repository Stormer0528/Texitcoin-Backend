import { Service } from 'typedi';
import {
  Arg,
  Args,
  Resolver,
  Query,
  Mutation,
  Authorized,
  Info,
  FieldResolver,
  Ctx,
  Root,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';

import { Member } from './member.entity';
import {
  MembersResponse,
  MemberQueryArgs,
  CreateMemberInput,
  UpdateMemberInput,
} from './member.type';
import { MemberService } from './member.service';
import { Context } from '@/context';
import { Sale } from '../sale/sale.entity';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';
import { Payout } from '../payout/payout.entity';

@Service()
@Resolver(() => Member)
export class MemberResolver {
  constructor(private readonly service: MemberService) {}

  @Query(() => MembersResponse)
  async members(
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

  @Authorized([UserRole.Admin])
  @Mutation(() => Member)
  async createMember(@Arg('data') data: CreateMemberInput): Promise<Member> {
    return this.service.createMember(data);
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Member)
  async updateMember(@Arg('data') data: UpdateMemberInput): Promise<Member> {
    return this.service.updateMember(data);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async sales(@Root() member: Member, @Ctx() ctx: Context): Promise<Sale[]> {
    return ctx.dataLoader.get('salesForMemberLoader').load(member.id);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async statistics(@Root() member: Member, @Ctx() ctx: Context): Promise<MemberStatistics[]> {
    return ctx.dataLoader.get('memberStatisticsForMemberLoader').load(member.id);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async payout(@Root() member: Member, @Ctx() ctx: Context): Promise<Payout> {
    return ctx.dataLoader.get('payoutForMemberLoader').load(member.id);
  }
}
