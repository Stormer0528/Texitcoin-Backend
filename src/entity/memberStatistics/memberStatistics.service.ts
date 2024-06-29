import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateMemberStatisticsInput, MemberStatisticsQueryArgs } from './memberStatistics.type';
import dayjs from 'dayjs';

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

  async getMemberDailyRewards(memberId: string, startDate?: string, endDate?: string) {
    const issuedAt = {};
    if (startDate) {
      issuedAt['gte'] = dayjs(startDate).startOf('day');
    }
    if (endDate) {
      issuedAt['lte'] = dayjs(endDate).endOf('day');
    }
    return await this.prisma.memberStatistics.findMany({
      select: {
        txcShared: true,
        hashPower: true,
        issuedAt: true,
      },
      where: {
        memberId,
        issuedAt,
      },
    });
  }
}
