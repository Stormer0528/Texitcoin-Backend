import { InputType, Field, ID } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

import { type UserGroupPermission } from '@/type';

// Create UserGroup Input and Response

@InputType()
export class CreateUserGroupInput {
  @Field()
  name: string;

  @Field()
  organizationId: string;

  @Field(() => GraphQLJSONObject)
  permissions: UserGroupPermission;
}

// Update UserGroup Input and Response

@InputType()
export class UpdateUserGroupInput extends CreateUserGroupInput {
  @Field(() => ID)
  id: string;
}
