import { ObjectType, Field, ID, Authorized } from 'type-graphql';
import { IsEmail } from 'class-validator';

import { BaseEntity } from '@/graphql/baseEntity';
import { Sale } from '@/entity/sale/sale.entity';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';

@ObjectType()
export class Member extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  fullname: string;

  @Field()
  sponsorName?: string;

  @Field()
  introducerFullName?: string;

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
  txcPayout: string;

  @Field()
  txcCold: string;

  @Field()
  address: string;

  @Field(() => [Sale], { nullable: 'itemsAndList' })
  sales?: Sale[];

  @Field(() => [MemberStatistics], { nullable: 'itemsAndList' })
  statistics?: MemberStatistics[];
}
