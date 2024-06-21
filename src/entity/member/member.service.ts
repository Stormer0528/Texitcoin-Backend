import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateMemberInput, UpdateMemberInput, MemberQueryArgs } from './member.type';

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

  async getMembersGroupByDate(params: MemberQueryArgs) {
    return this.prisma.member.groupBy({
      by: ['createdAt'],
      _count: {
        _all: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...params.parsePage,
    });
  }

  async getGroupsCountByDate(params: MemberQueryArgs) {
    return this.prisma.member
      .groupBy({
        by: ['createdAt'],
        orderBy: {
          createdAt: 'desc',
        },
      })
      .then((result) => result.length);
  }

  async getMembersCount(params: MemberQueryArgs): Promise<number> {
    return this.prisma.member.count({ where: params.where });
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
    return this.prisma.member.create({
      data,
    });
  }

  async updateMember({ id, ...data }: UpdateMemberInput) {
    return this.prisma.member.update({
      where: { id },
      data,
    });
  }

  async updatePassword({ id, password }: { id: string; password: string }) {
    return this.prisma.member.update({
      where: { id },
      data: { password },
    });
  }
}
