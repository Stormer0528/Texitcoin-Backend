import { Service } from 'typedi';
import { Resolver, Mutation, Arg, Authorized, Ctx, FieldResolver, Root } from 'type-graphql';

import { type Context } from '@/context';
import { Organization } from '@/entity/organization/organization.entity';

import { UserGroup } from './userGroup.entity';
import { CreateUserGroupInput, UpdateUserGroupInput } from './userGroup.type';
import { UserGroupService } from './userGroup.service';

@Service()
@Resolver(() => UserGroup)
export class UserGroupResolver {
  constructor(private readonly service: UserGroupService) {}

  @Authorized()
  @Mutation(() => UserGroup)
  async createUserGroup(@Arg('data') data: CreateUserGroupInput): Promise<UserGroup> {
    return this.service.createOrg(data);
  }

  @Authorized()
  @Mutation(() => UserGroup)
  async updateUserGroup(@Arg('data') data: UpdateUserGroupInput): Promise<UserGroup> {
    return this.service.updateOrg(data);
  }

  @Authorized()
  @FieldResolver()
  async organization(@Root() userGroup: UserGroup, @Ctx() ctx: Context): Promise<Organization> {
    return ctx.dataLoader.get('orgForUserGroupLoader').load(userGroup.id);
  }
}
