import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateMemberStatisticsInput, MemberStatisticsQueryArgs } from './memberStatistics.type';

@Service()
export class MemberStatisticsService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getMemberStatistics(params: MemberStatisticsQueryArgs) {
    return this.prisma.memberStatistics.findMany({
      include: { statistics: true, member: true },
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getMemberStatisticsCount(params: MemberStatisticsQueryArgs): Promise<number> {
    return this.prisma.memberStatistics.count({ where: params.where });
  }

  async getMemberStatisticsById(id: string) {
    return this.prisma.memberStatistics.findUnique({
      where: {
        id,
      },
    });
  }

  async createMemberStatistics(data: CreateMemberStatisticsInput) {
    return this.prisma.memberStatistics.create({
      data,
    });
  }
}
