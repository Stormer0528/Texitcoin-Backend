import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

@ObjectType()
export class DailyBlock extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  hashRate: number;

  @Field()
  difficulty: number;

  @Field()
  issuedAt: Date;
}