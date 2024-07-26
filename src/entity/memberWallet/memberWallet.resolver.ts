import { Service } from 'typedi';
import { Arg, Args, Resolver, Query, Mutation, Info, Authorized } from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';
import { MemberWallet } from './memberWallet.entity';
import {
  CreateMemberWalletInput,
  MemberWalletQueryArgs,
  MemberWalletResponse,
} from './memberWallet.type';
import { MemberWalletService } from './memberWallet.service';

@Service()
@Resolver(() => MemberWallet)
export class MemberWalletResolver {
  constructor(private readonly service: MemberWalletService) {}

  @Query(() => MemberWalletResponse)
  async payouts(
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
  @Mutation(() => MemberWallet)
  async createMemberWallet(@Arg('data') data: CreateMemberWalletInput): Promise<MemberWallet> {
    return this.service.createMemberWallet(data);
  }
}
