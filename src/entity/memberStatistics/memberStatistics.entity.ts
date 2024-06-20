import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

@ObjectType()
export class MemberStatistics extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  txcShared: number;

  @Field()
  hashPower: number;

  @Field()
  issuedAt: Date;
}
