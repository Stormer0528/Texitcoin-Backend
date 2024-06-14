import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';
import { User } from '@/entity/user/user.entity';

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

  @Field(() => User, { nullable: true })
  user?: User;
}
