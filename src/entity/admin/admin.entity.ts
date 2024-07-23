import { ObjectType, Field, ID } from 'type-graphql';
import { IsEmail, IsUrl } from 'class-validator';

import { BaseEntity } from '@/graphql/baseEntity';

@ObjectType()
export class Admin extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  password?: string;

  @Field()
  @IsUrl()
  avatar: string;
}
