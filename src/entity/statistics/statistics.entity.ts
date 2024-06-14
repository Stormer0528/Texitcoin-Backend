import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

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
}
