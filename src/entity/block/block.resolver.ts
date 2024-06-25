import { Service } from 'typedi';
import { Arg, Args, Resolver, Query, Mutation, Authorized, Ctx, Info } from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { type Context } from '@/context';
import { GroupedByCreatedAt, UserRole } from '@/type';

import { Block } from './block.entity';
import {
  BlocksResponse,
  BlockQueryArgs,
  CreateBlockInput,
  DailyBlocksResponse,
  DailyBlocks,
} from './block.type';
import { BlockService } from './block.service';

@Service()
@Resolver(() => Block)
export class BlockResolver {
  constructor(private readonly service: BlockService) {}

  @Query(() => BlocksResponse)
  async blocks(
    @Args() query: BlockQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<BlocksResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; blocks?: Promise<Block[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getBlocksCount(query);
    }

    if ('blocks' in fields) {
      promises.blocks = this.service.getBlocks(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; blocks?: Block[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Query(() => DailyBlocksResponse)
  async blocksByDate(
    @Args() query: BlockQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<DailyBlocksResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; blockInfo?: Promise<DailyBlocks[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getBlocksCount(query);
    }

    if ('blockInfo' in fields) {
      promises.blockInfo = this.service
        .getBlocksByDate(query)
        .then((totalGroups: GroupedByCreatedAt[]) =>
          totalGroups.map(({ issuedAt, _count: { _all: count } }: GroupedByCreatedAt) => {
            return { date: issuedAt.toISOString().split('T')[0], count };
          })
        );
    }

    const result = await Promise.all(Object.entries(promises));

    let response: DailyBlocksResponse = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Query(() => Number)
  async count(@Ctx() ctx: Context): Promise<Number> {
    return this.service.getBlocksCount({ orderBy: {}, parsePage: {}, where: {} });
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Block)
  async createBlock(@Arg('data') data: CreateBlockInput): Promise<Block> {
    // Hash the password
    return this.service.createBlock(data);
  }
}
