import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

@ObjectType()
export class Block extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  blockNo: number;

  @Field()
  hashRate: number;

  @Field()
  difficulty: number;

  @Field()
  issuedAt: Date;
}
