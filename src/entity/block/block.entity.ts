import { ObjectType, Field, ID } from 'type-graphql';
import { IsEmail } from 'class-validator';

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
}
