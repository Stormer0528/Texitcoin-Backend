import { Service } from 'typedi';
import { Arg, Args, Resolver, Query, Mutation, Authorized, Ctx, Info } from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { type Context } from '@/context';
import { UserRole } from '@/type';
import { createAccessToken, verifyPassword, hashPassword } from '@/utils/auth';

import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import {
  AdminLoginInput,
  AdminLoginResponse,
  AdminQueryArgs,
  AdminsResponse,
  CreateAdminInput,
  UpdateAdminInput,
  UpdateAdminPasswordByIdInput,
  UpdateAdminPasswordInput,
} from './admin.type';
import {
  IDsInput,
  ManySuccessResponse,
  SuccessResponse,
  SuccessResult,
} from '@/graphql/common.type';

const DEFAULT_PASSWORD = '123456789';

@Service()
@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly service: AdminService) {}

  @Authorized([UserRole.Admin])
  @Query(() => AdminsResponse)
  async admins(
    @Args() query: AdminQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<AdminsResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; admins?: Promise<Admin[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getAdminsCount(query);
    }

    if ('admins' in fields) {
      promises.admins = this.service.getAdmins(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; users?: Admin[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Query(() => Admin)
  async adminMe(@Ctx() ctx: Context): Promise<Admin> {
    return ctx.user! as Admin;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Admin)
  async createAdmin(@Arg('data') data: CreateAdminInput): Promise<Admin> {
    // Hash the password
    const hashedPassword = await hashPassword(data.password ?? DEFAULT_PASSWORD);
    return this.service.createAdmin({ ...data, password: hashedPassword });
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Admin)
  async updateAdmin(@Ctx() ctx: Context, @Arg('data') data: UpdateAdminInput): Promise<Admin> {
    return this.service.updateAdmin({
      id: ctx.user.id,
      ...data,
    });
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => SuccessResponse)
  async updatePasswordAdmin(
    @Ctx() ctx: Context,
    @Arg('data') data: UpdateAdminPasswordInput
  ): Promise<SuccessResponse> {
    const user = await this.service.getAdminById(ctx.user.id);

    const isValidPassword = await verifyPassword(data.oldPassword, user.password);

    if (!isValidPassword) {
      return {
        result: SuccessResult.failed,
        message: 'password doesn not match',
      };
    }

    const hashedPassword = await hashPassword(data.newPassword);
    try {
      await this.service.updatePassword({ id: user.id, password: hashedPassword });

      return {
        result: SuccessResult.success,
      };
    } catch (_err) {
      return {
        result: SuccessResult.failed,
        message: 'updating error',
      };
    }
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Admin)
  async updatePasswordAdminById(@Arg('data') data: UpdateAdminPasswordByIdInput): Promise<Admin> {
    const hashedPassword = await hashPassword(data.newPassword);
    return this.service.updatePassword({ id: data.id, password: hashedPassword });
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => ManySuccessResponse)
  async removeAdmins(@Arg('data') data: IDsInput): Promise<ManySuccessResponse> {
    try {
      const { count } = await this.service.removeAdmins(data);

      return { count };
    } catch (err) {
      return { count: 0 };
    }
  }

  @Mutation(() => AdminLoginResponse)
  async adminLogin(@Arg('data') data: AdminLoginInput): Promise<AdminLoginResponse> {
    const user = await this.service.getAdminByEmail(data.email);

    if (!user) {
      throw new Error('Invalid credentials are provided');
    }

    const isValidPassword = await verifyPassword(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials are provided');
    }

    return {
      accessToken: createAccessToken({ id: user.id, isAdmin: true }),
    };
  }
}
