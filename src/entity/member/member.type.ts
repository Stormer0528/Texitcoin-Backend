import { IsEmail } from 'class-validator';
import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType, ID } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';

import { Member } from '@/entity/member/member.entity';

// Member Query Args
@ArgsType()
export class MemberQueryArgs extends QueryArgsBase<Prisma.MemberWhereInput> {}

// Member list response with pagination ( total )
@ObjectType()
export class MembersResponse extends PaginatedResponse {
  @Field(() => [Member], { nullable: 'itemsAndList' })
  members?: Member[];
}

// Create Member Input and Response
@InputType()
export class CreateMemberInput {
  @Field()
  username: string;

  @Field()
  fullName: string;

  @Field()
  sponsorName?: string;

  @Field()
  introducerFullName?: string;

  @Field()
  address: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  userId: number;

  @Field()
  password: string;

  @Field()
  mobile: string;

  @Field()
  assetId: string;

  @Field()
  txcPayout: string;

  @Field()
  txcCold: string;

  // @Field(() => [Sale], { nullable: 'itemsAndList' })
  // sales?: Sale[];
}

@InputType()
export class UpdateMemberInput {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;
}
