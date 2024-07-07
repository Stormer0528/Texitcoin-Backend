import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';
import { Payout } from './payout.entity';

// Payout Query Args
@ArgsType()
export class PayoutQueryArgs extends QueryArgsBase<Prisma.PayoutWhereInput> {}

// Payout list response with pagination ( total )
@ObjectType()
export class PayoutResponse extends PaginatedResponse {
  @Field(() => [Payout], { nullable: 'itemsAndList' })
  payouts?: Payout[];
}

// Create Payout Input and Response
@InputType()
export class CreatePayoutInput {
  @Field()
  method: string;

  @Field()
  status: boolean;

  @Field()
  name: string;

  @Field()
  display: string;
}
