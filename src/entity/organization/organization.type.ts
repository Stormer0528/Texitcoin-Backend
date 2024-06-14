import { IsEmail } from 'class-validator';
import type { Prisma } from '@prisma/client';
import { InputType, Field, ArgsType, ObjectType } from 'type-graphql';

import { QueryArgsBase } from '@/graphql/queryArgs';
import { PaginatedResponse } from '@/graphql/paginatedResponse';

import { CreateAddressInput } from '@/entity/address/address.type';
import { Organization } from './organization.entity';

// Organizations Query Args
@ArgsType()
export class OrganizationQueryArgs extends QueryArgsBase<Prisma.OrganizationWhereInput> {}

// Organization list response with pagination ( total )
@ObjectType()
export class OrganizationsResponse extends PaginatedResponse {
  @Field(() => [Organization], { nullable: 'itemsAndList' })
  organizations?: Organization[];
}

// Create User Input and Response
@InputType()
export class CreateOrganizationInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field(() => [CreateAddressInput], { nullable: true })
  addresses?: CreateAddressInput[];
}
