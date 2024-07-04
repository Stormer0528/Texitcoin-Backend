import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';
import { Member } from '../member/member.entity';

@ObjectType()
export class Payout extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  method: string;

  @Field()
  status: boolean;

  @Field()
  name: string;

  @Field()
  display: string;

  @Field(() => [Member], { nullable: 'itemsAndList' })
  members?: Member[];
}
