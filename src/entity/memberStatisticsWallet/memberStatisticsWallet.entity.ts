import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

@ObjectType()
export class MemberStatisticsWallet extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  memberStatisticId: string;

  @Field()
  memberWalletId: string;

  @Field()
  txc: number;
}
