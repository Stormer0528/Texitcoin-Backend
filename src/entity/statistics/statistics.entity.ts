import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

import { Sale } from '@/entity/sale/sale.entity';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';
import { StatisticsSale } from '../statisticsSale/statisticsSale.entity';

@ObjectType()
export class Statistics extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  newBlocks: number;

  @Field()
  totalBlocks: number;

  @Field()
  totalHashPower: number;

  @Field()
  totalMembers?: number;

  @Field()
  status: boolean = false;

  @Field()
  txcShared: number;

  @Field()
  issuedAt: Date;

  @Field()
  from: Date;

  @Field()
  to: Date;

  @Field(() => [MemberStatistics], { nullable: 'itemsAndList' })
  memberStatistics?: MemberStatistics[];

  @Field(() => [StatisticsSale], { nullable: 'itemsAndList' })
  statisticsSales?: StatisticsSale[];
}
