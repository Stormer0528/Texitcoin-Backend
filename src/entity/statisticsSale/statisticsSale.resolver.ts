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
  Root,
  Ctx,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';

import { StatisticsSale } from './statisticsSale.entity';
import {
  StatisticsSaleResponse,
  StatisticsSaleQueryArgs,
  CreateStatisticsSaleInput,
  CreateManyStatisticsSaleInput,
} from './statisticsSale.type';
import { StatisticsSaleService } from './statisticsSale.service';
import { Context } from '@/context';
import { Statistics } from '../statistics/statistics.entity';
import { Sale } from '../sale/sale.entity';
import { IDInput, IDsInput, ManySuccessResponse } from '../common/common.type';

@Service()
@Resolver(() => StatisticsSale)
export class StatisticsSaleResolver {
  constructor(private readonly service: StatisticsSaleService) {}

  @Query(() => StatisticsSaleResponse)
  async statisticsSales(
    @Args() query: StatisticsSaleQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<StatisticsSaleResponse> {
    const { where, ...rest } = query;
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; statisticsSale?: any } = {};

    if ('total' in fields) {
      promises.total = this.service.getStatisticsSaleCount(query);
    }

    if ('statisticsSale' in fields) {
      promises.statisticsSale = this.service.getStatisticsSales(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; statisticsSales?: StatisticsSale[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => StatisticsSale)
  async createStatisticsSale(
    @Arg('data') data: CreateStatisticsSaleInput
  ): Promise<StatisticsSale> {
    return this.service.createStatisticsSale(data);
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => ManySuccessResponse)
  async createManyStatisticsSales(
    @Arg('data') data: CreateManyStatisticsSaleInput
  ): Promise<ManySuccessResponse> {
    try {
      const { count } = await this.service.createManyStatisticsSales(data);
      return { count };
    } catch (err) {
      return { count: 0 };
    }
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => ManySuccessResponse)
  async removeManyStatisticsSales(@Arg('data') data: IDsInput): Promise<ManySuccessResponse> {
    try {
      const { count } = await this.service.removeManyStatisticsSales(data);
      return { count };
    } catch (err) {
      return { count: 0 };
    }
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => ManySuccessResponse)
  async removeStatisticsSalesByStaitisId(@Arg('data') data: IDInput): Promise<ManySuccessResponse> {
    try {
      const { count } = await this.service.removeStatisticsSalesByStatisticId(data);
      return { count };
    } catch (err) {
      return { count: 0 };
    }
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async sale(@Root() statisticsSale: StatisticsSale, @Ctx() ctx: Context): Promise<Sale> {
    return ctx.dataLoader.get('saleForStatisticsSaleLoader').load(statisticsSale.id);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async statistics(
    @Root() statisticsSale: StatisticsSale,
    @Ctx() ctx: Context
  ): Promise<Statistics> {
    return ctx.dataLoader.get('statisticsForStatisticsSaleLoader').load(statisticsSale.id);
  }
}
