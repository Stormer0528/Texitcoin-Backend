import { Service } from 'typedi';
import { Arg, Args, Resolver, Query, Mutation, Info, Authorized } from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';
import { MemberStatisticsWallet } from './memberStatisticsWallet.entity';
import { MemberStatisticsWalletService } from './memberStatisticsWallet.service';
import {
  CreateMemberStatisticsWalletInput,
  MemberStatisticsWalletQueryArgs,
  MemberStatisticsWalletResponse,
} from './memberStatisticsWallet.type';

@Service()
@Resolver(() => MemberStatisticsWallet)
export class MemberWalletResolver {
  constructor(private readonly service: MemberStatisticsWalletService) {}

  @Query(() => MemberStatisticsWalletResponse)
  async payouts(
    @Args() query: MemberStatisticsWalletQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<MemberStatisticsWalletResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; memberStatisticsWallets?: any } = {};

    if ('total' in fields) {
      promises.total = this.service.getMemberStatisticsWalletCount(query);
    }

    if ('memberStatisticsWallets' in fields) {
      promises.memberStatisticsWallets = this.service.getMemberStatisticsWallets(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; memberStatisticsWallets?: MemberStatisticsWallet[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => MemberStatisticsWallet)
  async createMemberWallet(
    @Arg('data') data: CreateMemberStatisticsWalletInput
  ): Promise<MemberStatisticsWallet> {
    return this.service.createMemberStatisticsWallet(data);
  }
}
