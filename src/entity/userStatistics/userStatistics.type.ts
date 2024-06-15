import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';

import { UserStatistics } from '@/entity/userStatistics/userStatistics.entity';

// UserStatistics Query Args
@ArgsType()
export class UserStatisticsQueryArgs extends QueryArgsBase<Prisma.UserStatisticsWhereInput> {}

// UserStatistics list response with pagination ( total )
@ObjectType()
export class UserStatisticsResponse extends PaginatedResponse {
  @Field(() => [UserStatistics], { nullable: 'itemsAndList' })
  UserStatistics?: UserStatistics[];
}

// Create UserStatistics Input and Response
@InputType()
export class CreateUserStatisticsInput {
  @Field()
  blocks: number;

  @Field()
  hashPower: number;

  @Field()
  issuedAt: Date;

  // @Field(() => User, { nullable: 'itemsAndList' })
  // user?: User;
}
