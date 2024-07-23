import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';
import { Payment } from './payment.entity';

// Payment Query Args
@ArgsType()
export class PaymentQueryArgs extends QueryArgsBase<Prisma.PaymentWhereInput> {}

// Payment list response with pagination ( total )
@ObjectType()
export class PaymentResponse extends PaginatedResponse {
  @Field(() => [Payment], { nullable: 'itemsAndList' })
  payments?: Payment[];
}

// Create Payment Input and Response
@InputType()
export class CreatePaymentInput {
  @Field()
  name: string;

  @Field()
  status: boolean;
}
