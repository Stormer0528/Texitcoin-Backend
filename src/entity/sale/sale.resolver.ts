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
import { SalesResponse, SaleQueryArgs, CreateSaleInput, UpdateSaleInput } from './sale.type';
import { SaleService } from './sale.service';
import { Context } from '@/context';
import { Member } from '../member/member.entity';
import { Package } from '../package/package.entity';
import { StatisticsSale } from '../statisticsSale/statisticsSale.entity';
import { IDInput, SuccessResponse, SuccessResult } from '@/graphql/common.type';

@Service()
@Resolver(() => Sale)
export class SaleResolver {
  constructor(private readonly service: SaleService) {}

  @Query(() => SalesResponse)
  async sales(
    @Ctx() ctx: Context,
    @Args() query: SaleQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<SalesResponse> {
    const { where, ...rest } = query;
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; sales?: any } = {};

    if (!ctx.isAdmin) {
      query.filter = {
        ...query.filter,
        memberId: ctx.user.id,
      };
    }

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

  @Authorized([UserRole.Admin])
  @Mutation(() => Sale)
  async updateSale(@Arg('data') data: UpdateSaleInput): Promise<Sale> {
    return this.service.updateSale({ ...data });
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => SuccessResponse)
  async removeSale(@Arg('data') data: IDInput): Promise<SuccessResponse> {
    await this.service.removeSale(data);
    return {
      result: SuccessResult.success,
    };
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async member(@Root() sale: Sale, @Ctx() ctx: Context): Promise<Member> {
    return ctx.dataLoader.get('memberForSaleLoader').load(sale.memberId);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async package(@Root() sale: Sale, @Ctx() ctx: Context): Promise<Package> {
    return ctx.dataLoader.get('packageForSaleLoader').load(sale.packageId);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async statisticsSales(@Root() sale: Sale, @Ctx() ctx: Context): Promise<StatisticsSale[]> {
    return ctx.dataLoader.get('statisticsSalesForSaleLoader').load(sale.id);
  }
}
