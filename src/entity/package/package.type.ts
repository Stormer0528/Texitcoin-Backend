import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';
import { Package } from './package.entity';

// Package Query Args
@ArgsType()
export class PackageQueryArgs extends QueryArgsBase<Prisma.PackageWhereInput> {}

// Package list response with pagination ( total )
@ObjectType()
export class PackageResponse extends PaginatedResponse {
  @Field(() => [Package], { nullable: 'itemsAndList' })
  packages?: Package[];
}

// Create Package Input and Response
@InputType()
export class CreatePackageInput {
  @Field()
  productName: string;

  @Field()
  amount: number;

  @Field()
  status: boolean;

  @Field()
  date: Date;

  @Field()
  token: number;
}
