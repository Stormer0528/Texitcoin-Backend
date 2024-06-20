import { IsEmail } from 'class-validator';
import type { Prisma } from '@prisma/client';
import { ObjectType, InputType, Field, ArgsType, ID, Authorized, Int } from 'type-graphql';

import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';

import { User } from '@/entity/user/user.entity';
import { Sale } from '@/entity/sale/sale.entity';

// User Query Args
@ArgsType()
export class UserQueryArgs extends QueryArgsBase<Prisma.UserWhereInput> {}

// User list response with pagination ( total )
@ObjectType()
export class UsersResponse extends PaginatedResponse {
  @Field(() => [User], { nullable: 'itemsAndList' })
  users?: User[];
}

// Create User Input and Response
@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field()
  isAdmin: boolean = false;
}

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Authorized()
  @Field({ nullable: true })
  isAdmin: boolean;
}

@InputType()
export class UpdatePasswordInput {
  @Field(() => ID)
  id: string;

  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}

// Login Input and Response

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  isAdmin?: boolean = false;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}
