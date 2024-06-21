import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';
import { Member, Statistics } from '@prisma/client';

@ObjectType()
export class MemberStatistics extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  memberId: string;

  @Field()
  statisticsId: string;

  @Field()
  txcShared: number;

  @Field()
  hashPower: number;

  @Field()
  percent: number;

  @Field()
  issuedAt: Date;

  @Field()
  member?: Member;

  @Field()
  statistics?: Statistics;
}
