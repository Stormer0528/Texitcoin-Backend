import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';
import { MemberWallet } from './memberWallet.entity';

// MemberWallet Query Args
@ArgsType()
export class MemberWalletQueryArgs extends QueryArgsBase<Prisma.MemberWalletWhereInput> {}

// MemberWallet list response with pagination ( total )
@ObjectType()
export class MemberWalletResponse extends PaginatedResponse {
  @Field(() => [MemberWallet], { nullable: 'itemsAndList' })
  MemberWallets?: MemberWallet[];
}

// Create MemberWallet Input and Response
@InputType()
export class CreateMemberWalletInput {
  @Field()
  memberId: string;

  @Field()
  payoutId: string;

  @Field()
  address: string;

  @Field()
  percent: number;
}