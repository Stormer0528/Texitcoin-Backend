import { ObjectType, Field, ID, Authorized } from 'type-graphql';
import { IsEmail } from 'class-validator';

import { BaseEntity } from '@/graphql/baseEntity';

import { Address } from '@/entity/address/address.entity';
import { User } from '@/entity/user/user.entity';
import { UserGroup } from '@/entity/userGroup/userGroup.entity';

import { UserRole } from '@/type';

@ObjectType()
export class Organization extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  isArchived: boolean;

  @Field({ nullable: true })
  isIndependent: boolean;

  // TODO: If this field is included in organizations query, it should be in dataLoader
  @Field(() => [UserGroup], { nullable: 'itemsAndList' })
  userGroups?: UserGroup[];

  // TODO: If this field is included in organizations query, it should be in dataLoader
  @Authorized([UserRole.Admin])
  @Field(() => [User], { nullable: 'itemsAndList' })
  users?: User[];

  // TODO: If this field is included in organizations query, it should be in dataLoader
  @Field(() => [Address], { nullable: 'itemsAndList' })
  addresses?: Address[];
}
