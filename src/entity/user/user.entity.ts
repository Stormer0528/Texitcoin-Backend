import { ObjectType, Field, ID, Authorized } from 'type-graphql';
import { IsEmail } from 'class-validator';

import { BaseEntity } from '@/graphql/baseEntity';
import { Sale } from '@/entity/sale/sale.entity';

@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  fullname: string;

  @Field()
  sponsorName: string;

  @Field()
  introducerFullName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password?: string;

  @Field()
  mobile: string;

  @Field()
  assetId: string;

  @Field()
  commissionPayout: string;

  @Field()
  txcPayout: string;

  @Field()
  txcCold: string;

  @Field()
  isAdmin: boolean = false;

  @Field(() => [Sale], { nullable: 'itemsAndList' })
  sales?: Sale[];
}
