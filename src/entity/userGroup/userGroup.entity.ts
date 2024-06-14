import { ObjectType, Field, ID } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

import { Organization } from '@/entity/organization/organization.entity';

import { BaseEntity } from '@/graphql/baseEntity';
import { UserGroupPermission } from '@/type';

@ObjectType()
export class UserGroup extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => GraphQLJSONObject)
  permissions: UserGroupPermission;

  @Field()
  isArchived: boolean;

  @Field(() => Organization, { nullable: true })
  organization?: Organization;
}
