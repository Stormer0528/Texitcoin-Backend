import { Service } from 'typedi';
import {
  Arg,
  Args,
  Resolver,
  Query,
  Mutation,
  Authorized,
  Info,
  FieldResolver,
  Ctx,
  Root,
  UseMiddleware,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';

import { Member } from './member.entity';
import {
  MembersResponse,
  MemberQueryArgs,
  CreateMemberInput,
  UpdateMemberInput,
  MemberLoginResponse,
  MemberLoginInput,
  UpdateMemberPasswordInput,
  UpdateMemberPasswordInputById,
} from './member.type';
import { MemberService } from './member.service';
import { Context } from '@/context';
import { Sale } from '../sale/sale.entity';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';
import { createAccessToken, hashPassword, verifyPassword } from '@/utils/auth';
import {
  EmailInput,
  IDInput,
  SuccessResponse,
  SuccessResult,
  TokenInput,
} from '../../graphql/common.type';
import { userPermission } from '../admin/admin.permission';
import { MemberWallet } from '../memberWallet/memberWallet.entity';
import { MemberWalletService } from '../memberWallet/memberWallet.service';
import _ from 'lodash';
import { DEFAULT_PASSWORD } from '@/consts';

@Service()
@Resolver(() => Member)
export class MemberResolver {
  constructor(
    private readonly service: MemberService,
    private readonly memberWalletService: MemberWalletService
  ) {}

  @Authorized([UserRole.Admin])
  @Query(() => MembersResponse)
  async members(
    @Args() query: MemberQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<MembersResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; members?: Promise<Member[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getMembersCount(query);
    }

    if ('members' in fields) {
      promises.members = this.service.getMembers(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; members?: Member[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Member)
  async createMember(@Arg('data') data: CreateMemberInput): Promise<Member> {
    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
    const member = await this.service.createMember({
      ..._.omit(data, 'wallets'),
      password: hashedPassword,
    });
    await this.memberWalletService.createManyMemberWallets(
      data.wallets.map((wallet) => ({ ...wallet, memberId: member.id }))
    );
    return member;
  }

  @Authorized()
  @UseMiddleware(userPermission)
  @Mutation(() => Member)
  async updateMember(@Ctx() ctx: Context, @Arg('data') data: UpdateMemberInput): Promise<Member> {
    const member = await this.service.updateMember({
      id: data.id ?? ctx.user.id,
      ..._.omit(data, 'wallets'),
    });
    await this.memberWalletService.updateManyMemberWallet({
      memberId: data.id ?? ctx.user.id,
      wallets: data.wallets,
    });

    return member;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => SuccessResponse)
  async removeMember(@Arg('data') data: IDInput): Promise<SuccessResponse> {
    await this.service.removeMember(data.id);
    return {
      result: SuccessResult.success,
    };
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async sales(@Root() member: Member, @Ctx() ctx: Context): Promise<Sale[]> {
    return ctx.dataLoader.get('salesForMemberLoader').load(member.id);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async statistics(@Root() member: Member, @Ctx() ctx: Context): Promise<MemberStatistics[]> {
    return ctx.dataLoader.get('memberStatisticsForMemberLoader').load(member.id);
  }

  @FieldResolver({ nullable: true })
  async sponsor(@Root() member: Member, @Ctx() ctx: Context): Promise<Member> {
    return member.sponsorId
      ? ctx.dataLoader.get('sponsorForMemberLoader').load(member.sponsorId)
      : null;
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async introduceMembers(@Root() member: Member, @Ctx() ctx: Context): Promise<Member[]> {
    return ctx.dataLoader.get('introduceMembersForMemberLoader').load(member.id);
  }

  @FieldResolver({ nullable: 'itemsAndList' })
  async memberWallets(@Root() member: Member, @Ctx() ctx: Context): Promise<MemberWallet[]> {
    return ctx.dataLoader.get('memberWalletsForMemberLoader').load(member.id);
  }

  @Authorized()
  @Query(() => Member)
  async memberMe(@Ctx() ctx: Context): Promise<Member> {
    return ctx.user! as Member;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Member)
  async updatePasswordMemberById(
    @Arg('data') data: UpdateMemberPasswordInputById
  ): Promise<Member> {
    const hashedPassword = await hashPassword(data.newPassword);

    return await this.service.updateMember({ id: data.id, password: hashedPassword });
  }

  @Authorized()
  @Mutation(() => SuccessResponse)
  async updatePasswordMember(
    @Ctx() ctx: Context,
    @Arg('data') data: UpdateMemberPasswordInput
  ): Promise<SuccessResponse> {
    const { password } = await this.service.getMemberById(ctx.user.id);
    const hashedPassword = await hashPassword(data.newPassword);

    const isValid = await verifyPassword(data.oldPassword, password);

    if (isValid) {
      await this.service.updateMember({ id: ctx.user.id, password: hashedPassword });
      return {
        result: SuccessResult.success,
      };
    } else {
      return {
        result: SuccessResult.failed,
      };
    }
  }

  @Mutation(() => MemberLoginResponse)
  async memberLogin(@Arg('data') data: MemberLoginInput): Promise<MemberLoginResponse> {
    const member = await this.service.getMemberByEmail(data.email);

    if (!member) {
      throw new Error('Invalid credentials are provided');
    }

    const isValidPassword = await verifyPassword(data.password, member.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials are provided');
    }

    return {
      accessToken: createAccessToken({
        id: member.id,
        isAdmin: false,
      }),
    };
  }

  @Mutation(() => SuccessResponse)
  async resetPasswordRequest(@Arg('data') data: IDInput): Promise<SuccessResponse> {
    const { token } = await this.service.generateResetTokenById(data);
    if (token) {
      return {
        result: SuccessResult.success,
        message: `${process.env.MEMBER_URL}/resetpassword?token=${token}`,
      };
    } else {
      return {
        result: SuccessResult.failed,
        message: 'creating token failed',
      };
    }
  }

  @Mutation(() => SuccessResponse)
  async resetPasswordByToken(@Arg('data') data: TokenInput): Promise<SuccessResponse> {
    await this.service.resetPasswordByToken(data);
    return {
      result: SuccessResult.success,
    };
  }
}
