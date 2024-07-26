import { ObjectType, Field, ID } from 'type-graphql';
import { IsEmail } from 'class-validator';

import { BaseEntity } from '@/graphql/baseEntity';
import { Sale } from '@/entity/sale/sale.entity';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';
import { Payout } from '../payout/payout.entity';

@ObjectType()
export class Member extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  fullName: string;

  @Field(() => ID, { nullable: true })
  sponsorid: string;

  introducerFullName?: string;

  @Field()
  @IsEmail()
  email: string;

  userId: number;

  @Field()
  mobile: string;

  @Field()
  assetId: string;

  @Field(() => ID)
  payoutId: string;

  @Field()
  wallet: string;

  @Field()
  primaryAddress: string;

  @Field({ nullable: true })
  secondaryAddress?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  zipCode?: string;

  @Field(() => [Sale], { nullable: 'itemsAndList' })
  sales?: Sale[];

  @Field(() => [MemberStatistics], { nullable: 'itemsAndList' })
  statistics?: MemberStatistics[];

  @Field(() => Payout, { nullable: true })
  payout?: Payout;

  @Field(() => Member, { nullable: true })
  sponsor?: Member;

  @Field(() => [Member], { nullable: 'itemsAndList' })
  introduceMembers?: Member[];
}
