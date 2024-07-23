import { Service } from 'typedi';
import {
  Arg,
  Args,
  Resolver,
  Query,
  Mutation,
  Info,
  Authorized,
  FieldResolver,
  Ctx,
  Root,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';
import { Payment } from './payment.entity';
import { Context } from '@/context';
import { Sale } from '../sale/sale.entity';
import { PaymentService } from './payment.service';
import { CreatePaymentInput, PaymentQueryArgs, PaymentResponse } from './payment.type';

@Service()
@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly service: PaymentService) {}

  @Query(() => PaymentResponse)
  async payments(
    @Args() query: PaymentQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<PaymentResponse> {
    const { where, ...rest } = query;
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; payments?: any } = {};

    if ('total' in fields) {
      promises.total = this.service.getPaymentsCount(query);
    }

    if ('payments' in fields) {
      promises.payments = this.service.getPayments(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; payments?: Payment[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Payment)
  async createPayment(@Arg('data') data: CreatePaymentInput): Promise<Payment> {
    return this.service.createPayment({ ...data });
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async sales(@Root() payment: Payment, @Ctx() ctx: Context): Promise<Sale[]> {
    return ctx.dataLoader.get('salesForPaymentLoader').load(payment.id);
  }
}
