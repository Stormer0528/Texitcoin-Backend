import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';
import { Member } from '../member/member.entity';
import { Package } from '../package/package.entity';
import { StatisticsSale } from '../statisticsSale/statisticsSale.entity';
import { Payment } from '../payment/payment.entity';

@ObjectType()
export class Sale extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  invoiceNo: number;

  @Field()
  paymentMethodId: string;

  @Field()
  status: boolean;

  @Field(() => ID)
  memberId: string;

  @Field(() => Member, { nullable: true })
  member?: Member;

  @Field(() => ID)
  packageId: string;

  @Field(() => Package, { nullable: true })
  package?: Package;

  @Field()
  orderedAt: Date;

  @Field(() => [StatisticsSale], { nullable: 'itemsAndList' })
  statisticsSales?: StatisticsSale[];

  @Field(() => Payment, { nullable: true })
  payments?: Payment[];
}
