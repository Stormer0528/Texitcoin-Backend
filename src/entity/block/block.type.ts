import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType, ID, Authorized, Int } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';

import { Block } from '@/entity/block/block.entity';

// Block Query Args
@ArgsType()
export class BlockQueryArgs extends QueryArgsBase<Prisma.BlockWhereInput> {}

// Block list response with pagination ( total )
@ObjectType()
export class BlocksResponse extends PaginatedResponse {
  @Field(() => [Block], { nullable: 'itemsAndList' })
  blocks?: Block[];
}

@ObjectType()
export class DailyBlocksResponse {
  @Field(() => [DailyBlocks], { nullable: 'itemsAndList' })
  blockInfo?: DailyBlocks[];
}

@ObjectType()
export class DailyBlocks {
  @Field()
  date: string;

  @Field()
  count: number;
}

// Create Block Input and Response
@InputType()
export class CreateBlockInput {
  @Field()
  blockNo: number;

  @Field()
  hashRate: number;

  @Field()
  difficulty: number;

  @Field()
  issuedAt: Date;
}
