import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';
import { MemberStatisticsWallet } from './memberStatisticsWallet.entity';

// MemberStatisticsWallet Query Args
@ArgsType()
export class MemberStatisticsWalletQueryArgs extends QueryArgsBase<Prisma.MemberStatisticsWalletWhereInput> {}

// MemberStatisticsWallet list response with pagination ( total )
@ObjectType()
export class MemberStatisticsWalletResponse extends PaginatedResponse {
  @Field(() => [MemberStatisticsWallet], { nullable: 'itemsAndList' })
  MemberStatisticsWallet?: MemberStatisticsWallet[];
}

// Create MemberStatisticsWallet Input and Response
@InputType()
export class CreateMemberStatisticsWalletInput {
  @Field()
  memberStatisticId: string;

  @Field()
  memberWalletId: string;

  @Field()
  txc: number;
}
