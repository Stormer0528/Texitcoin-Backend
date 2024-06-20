import { Service } from 'typedi';
import {
  Arg,
  Args,
  Resolver,
  Query,
  Mutation,
  Authorized,
  FieldResolver,
  Ctx,
  Root,
  UseMiddleware,
  Info,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { type Context } from '@/context';
import { UserRole } from '@/type';
import { createAccessToken, verifyPassword, hashPassword } from '@/utils/auth';
import { Sale } from '@/entity/sale/sale.entity';

import { User } from './user.entity';
import {
  UsersResponse,
  UserQueryArgs,
  CreateUserInput,
  LoginInput,
  LoginResponse,
  UpdateUserInput,
  UpdatePasswordInput,
} from './user.type';
import { UserService } from './user.service';
import { userPermission } from './user.permission';

@Service()
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Authorized([UserRole.Admin])
  @Query(() => UsersResponse)
  async users(
    @Args() query: UserQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<UsersResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; users?: Promise<User[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getUsersCount(query);
    }

    if ('users' in fields) {
      promises.users = this.service.getUsers(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; users?: User[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Query(() => Number)
  async count(@Ctx() ctx: Context): Promise<Number> {
    return this.service.getUsersCount({ orderBy: {}, parsePage: {}, where: {} });
  }

  @Authorized()
  @Query(() => User)
  async me(@Ctx() ctx: Context): Promise<User> {
    return ctx.user!;
  }

  // @Authorized()
  // @FieldResolver({ nullable: 'itemsAndList' })
  // async sales(@Root() user: User, @Ctx() ctx: Context): Promise<Sale[]> {
  //   return ctx.dataLoader.get('userGroupForUserLoader').load(user.id);
  // }

  @Authorized([UserRole.Admin])
  @Mutation(() => User)
  async createUser(@Arg('data') data: CreateUserInput): Promise<User> {
    // Hash the password
    const hashedPassword = await hashPassword('123456789');
    return this.service.createUser({ ...data, password: hashedPassword });
  }

  @Authorized()
  @UseMiddleware(userPermission)
  @Mutation(() => User)
  async updateUser(@Arg('data') data: UpdateUserInput): Promise<User> {
    return this.service.updateUser(data);
  }

  @Authorized()
  // Args should have `data` property
  @UseMiddleware(userPermission)
  @Mutation(() => User)
  async updatePassword(@Arg('data') data: UpdatePasswordInput): Promise<User> {
    const user = await this.service.getUserById(data.id);

    const isValidPassword = await verifyPassword(data.newPassword, user.password);

    if (!isValidPassword) {
      throw new Error('Old password does not match');
    }

    return this.service.updatePassword({ id: data.id, password: data.newPassword });
  }

  @Mutation(() => LoginResponse)
  async login(@Arg('data') data: LoginInput): Promise<LoginResponse> {
    const user = await this.service.getUserByEmail(data.email);

    if (!user) {
      throw new Error('Invalid credentials are provided');
    }

    const isValidPassword = await verifyPassword(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials are provided');
    }

    if (data.isAdmin && !user.isAdmin) {
      throw new Error("You don't have permission");
    }

    return {
      accessToken: createAccessToken(user.id),
    };
  }
}
