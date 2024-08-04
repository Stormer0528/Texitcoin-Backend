import { Service } from 'typedi';
import {
  Arg,
  Args,
  Resolver,
  Query,
  Mutation,
  Info,
  Authorized,
  Root,
  Ctx,
  FieldResolver,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';
import { MemberWallet } from './memberWallet.entity';
import {
  MemberWalletQueryArgs,
  MemberWalletResponse,
  UpdateMemberWalletInput,
} from './memberWallet.type';
import { MemberWalletService } from './memberWallet.service';
import { Context } from '@/context';
import { Member } from '../member/member.entity';
import { Payout } from '../payout/payout.entity';
import { MemberStatisticsWallet } from '../memberStatisticsWallet/memberStatisticsWallet.entity';
import { ManySuccessResponse, SuccessResponse, SuccessResult } from '@/graphql/common.type';

@Service()
@Resolver(() => MemberWallet)
export class MemberWalletResolver {
  constructor(private readonly service: MemberWalletService) {}

  @Query(() => MemberWalletResponse)
  async memberWallets(
    @Args() query: MemberWalletQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<MemberWalletResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; memberWallets?: any } = {};

    if ('total' in fields) {
      promises.total = this.service.getMemberWalletsCount(query);
    }

    if ('memberWallets' in fields) {
      promises.memberWallets = this.service.getMemberWallets(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; memberWallets?: MemberWallet[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => SuccessResponse)
  async updateMemberWallet(@Arg('data') data: UpdateMemberWalletInput): Promise<SuccessResponse> {
    await this.service.updateManyMemberWallet(data);
    return {
      result: SuccessResult.success,
    };
  }

  @FieldResolver({ nullable: true })
  async member(@Root() member: MemberWallet, @Ctx() ctx: Context): Promise<Member> {
    return ctx.dataLoader.get('memberForMemberWalletLoader').load(member.id);
  }

  @FieldResolver({ nullable: true })
  async payout(@Root() member: MemberWallet, @Ctx() ctx: Context): Promise<Payout> {
    return ctx.dataLoader.get('payoutForMemberWalletLoader').load(member.id);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async memberStatisticsWallets(
    @Root() member: MemberWallet,
    @Ctx() ctx: Context
  ): Promise<MemberStatisticsWallet[]> {
    return ctx.dataLoader.get('memberStatisticsWalletsForMemberWalletLoader').load(member.id);
  }
}
