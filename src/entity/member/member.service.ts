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

  async createMember(data: CreateMemberInput) {
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

  async updateMember({ id, ...data }: UpdateMemberInput) {
    return this.prisma.member.update({
      where: { id },
      data,
    });
  }
}
