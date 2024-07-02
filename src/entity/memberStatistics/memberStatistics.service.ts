import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import {
  CreateManyMemberStatisticsInput,
  CreateMemberStatisticsInput,
  MemberStatisticsQueryArgs,
} from './memberStatistics.type';

@Service()
export class MemberStatisticsService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getMemberStatistics(params: MemberStatisticsQueryArgs) {
    return this.prisma.memberStatistics.findMany({
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

  async createManyMemberStatistics(data: CreateManyMemberStatisticsInput) {
    return this.prisma.memberStatistics.createMany({
      data: data.memberStatistics,
    });
  }

  async getTotalHashPowerAndTXCShared(memberId: string) {
    const { _sum: data } = await this.prisma.memberStatistics.aggregate({
      _sum: {
        hashPower: true,
        txcShared: true,
      },
      where: {
        memberId,
      },
    });

    return data;
  }
}
