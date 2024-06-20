import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

import { Sale } from '@/entity/sale/sale.entity';

@ObjectType()
export class Statistics extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  newBlocks: number;

  @Field()
  totalBlocks: number;

  @Field()
  newHashPower: number;

  @Field()
  totalHashPower: number;

  @Field()
  members?: number;

  @Field()
  difficulty: number;

  @Field()
  hashRate: number;

  @Field()
  issuedAt: Date;

  @Field(() => [Sale], { nullable: 'itemsAndList' })
  sales?: Sale[];
}
