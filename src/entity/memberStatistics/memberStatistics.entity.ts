import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';
import { Member } from '../member/member.entity';
import { Statistics } from '../statistics/statistics.entity';

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

  @Field(() => Member, { nullable: true })
  member?: Member;

  @Field(() => Statistics, { nullable: true })
  statistics?: Statistics;
}
