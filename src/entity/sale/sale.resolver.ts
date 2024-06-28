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

import { Sale } from './sale.entity';
import { SalesResponse, SaleQueryArgs, CreateSaleInput } from './sale.type';
import { SaleService } from './sale.service';
import { Context } from '@/context';
import { Member } from '../member/member.entity';

@Service()
@Resolver(() => Sale)
export class SaleResolver {
  constructor(private readonly service: SaleService) {}

  @Query(() => SalesResponse)
  async sales(
    @Args() query: SaleQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<SalesResponse> {
    const { where, ...rest } = query;
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; sales?: any } = {};

    if ('total' in fields) {
      promises.total = this.service.getSalesCount(query);
    }

    if ('sales' in fields) {
      promises.sales = this.service.getSales(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; sales?: Sale[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Sale)
  async createSale(@Arg('data') data: CreateSaleInput): Promise<Sale> {
    return this.service.createSale({ ...data });
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async member(@Root() sale: Sale, @Ctx() ctx: Context): Promise<Member> {
    return ctx.dataLoader.get('memberForSaleLoader').load(sale.id);
  }
}
