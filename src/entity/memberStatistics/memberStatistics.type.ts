import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';

import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';

// MemberStatistics Query Args
@ArgsType()
export class MemberStatisticsQueryArgs extends QueryArgsBase<Prisma.MemberStatisticsWhereInput> {}

// MemberStatistics list response with pagination ( total )
@ObjectType()
export class MemberStatisticsResponse extends PaginatedResponse {
  @Field(() => [MemberStatistics], { nullable: 'itemsAndList' })
  memberStatistics?: MemberStatistics[];
}

// Create UserStatistics Input and Response
@InputType()
export class CreateMemberStatisticsInput {
  @Field()
  username: string;

  @Field()
  txcShared: number;

  @Field()
  hashPower: number;

  @Field()
  issuedAt: Date;
}
