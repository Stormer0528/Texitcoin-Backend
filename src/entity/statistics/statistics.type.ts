import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType, ID } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';

import { Statistics } from '@/entity/statistics/statistics.entity';

// Statistics Query Args
@ArgsType()
export class StatisticsQueryArgs extends QueryArgsBase<Prisma.StatisticsWhereInput> {}

// Statistics list response with pagination ( total )
@ObjectType()
export class StatisticsResponse extends PaginatedResponse {
  @Field(() => [Statistics], { nullable: 'itemsAndList' })
  statistics?: Statistics[];
}

// Create Statistics Input and Response
@InputType()
export class CreateStatisticsInput {
  @Field()
  newBlocks: number;

  @Field()
  totalBlocks: number;

  @Field()
  newHashPower: number;

  @Field()
  totalHashPower: number;

  @Field()
  members?: number;

  @Field({ nullable: true })
  status: boolean = false;

  @Field()
  issuedAt: Date;

  @Field()
  from: Date;

  @Field()
  to: Date;
}
