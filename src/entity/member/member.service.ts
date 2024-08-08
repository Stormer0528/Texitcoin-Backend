import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateMemberInput, UpdateMemberInput, MemberQueryArgs } from './member.type';
import { Prisma } from '@prisma/client';
import { IDInput, TokenInput } from '@/graphql/common.type';
import { createAccessToken, createResetPasswordToken, hashPassword } from '@/utils/auth';
import { DEFAULT_PASSWORD } from '@/consts';

@Service()
export class MemberService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getMembers(params: MemberQueryArgs) {
    return this.prisma.member.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getMembersCount(params: Pick<MemberQueryArgs, 'where'>): Promise<number> {
    return this.prisma.member.count({ where: params.where });
  }

  async getMembersCountByDate(range: { start: Date; end: Date }) {
    return await this.prisma.$queryRaw<{ date: Date; count: number }[]>`
      SELECT 
        DATE("createdAt") as date, 
        CAST(COUNT("userId") as INT) as count
      FROM 
        Members
      WHERE 
        "createdAt" BETWEEN ${range.start} AND ${range.end}
      GROUP BY 
        DATE("createdAt")
      ORDER BY
        date ASC`;
  }

  async getMemberById(id: string) {
    return this.prisma.member.findUnique({
      where: {
        id,
      },
    });
  }

  async getMemberByUsername(username: string) {
    return this.prisma.member.findUnique({
      where: {
        username,
      },
    });
  }

  async createMember(data: CreateMemberInput & { password: string }) {
    const maxUserId = await this.prisma.member.aggregate({
      _max: {
        userId: true,
      },
    });
    return this.prisma.member.create({
      data: {
        ...data,
        userId: maxUserId._max.userId + 1,
      },
    });
  }

  async updateMember({ id, ...data }: UpdateMemberInput & { password?: string }) {
    return this.prisma.member.update({
      where: { id },
      data,
    });
  }

  async getMemberByEmail(email: string) {
    return this.prisma.member.findFirst({
      where: {
        email,
      },
    });
  }

  async removeMember(id: string) {
    return this.prisma.member.delete({
      where: {
        id,
      },
    });
  }

  async generateResetTokenById(data: IDInput) {
    const token = createResetPasswordToken();
    return this.prisma.member.update({
      where: {
        id: data.id,
      },
      data: {
        token,
      },
    });
  }

  async resetPasswordByToken(data: TokenInput) {
    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
    return this.prisma.member.update({
      where: {
        token: data.token,
      },
      data: {
        password: hashedPassword,
      },
    });
  }
}
