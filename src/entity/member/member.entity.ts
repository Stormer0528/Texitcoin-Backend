import { ObjectType, Field, ID } from 'type-graphql';
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
  fullName: string;

  sponsorName?: string;

  introducerFullName?: string;

  @Field()
  @IsEmail()
  email: string;

  userId: number;

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
