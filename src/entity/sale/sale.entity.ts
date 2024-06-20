import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';
import { User } from '@/entity/user/user.entity';
import { Statistics } from '../statistics/statistics.entity';

@ObjectType()
export class Sale extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  invoiceNo: number;

  @Field()
  productName: string;

  @Field()
  paymentMethod: string;

  @Field()
  amount: number;

  @Field()
  hashPower: number;

  @Field(() => ID)
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => ID)
  statisticsId: string;

  @Field(() => Statistics, { nullable: true })
  statistics?: Statistics;

  @Field()
  issuedAt: Date;
}
