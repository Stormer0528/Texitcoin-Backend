import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import {
  CreateManyStatisticsSaleInput,
  CreateStatisticsSaleInput,
  StatisticIDInput,
  StatisticsSaleIDsInput,
  StatisticsSaleQueryArgs,
} from './statisticsSale.type';
import { Prisma } from '@prisma/client';

@Service()
export class StatisticsSaleService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getStatisticsSales(params: StatisticsSaleQueryArgs) {
    return this.prisma.statisticsSale.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getStatisticsSaleCount(params: StatisticsSaleQueryArgs): Promise<number> {
    return this.prisma.statisticsSale.count({ where: params.where });
  }

  async getMemberStatisticsById(id: string) {
    return this.prisma.memberStatistics.findUnique({
      where: {
        id,
      },
    });
  }

  async createStatisticsSale(data: CreateStatisticsSaleInput) {
    return this.prisma.statisticsSale.create({
      data,
    });
  }

  async createManyStatisticsSales(data: CreateManyStatisticsSaleInput) {
    return this.prisma.statisticsSale.createMany({
      data: data.statisticsSales,
    });
  }

  async removeManyStatisticsSales(data: StatisticsSaleIDsInput) {
    return this.prisma.statisticsSale.deleteMany({
      where: {
        id: {
          in: data.ids,
        },
      },
    });
  }

  async removeStatisticsSalesByStatisticId(data: StatisticIDInput) {
    return this.prisma.statisticsSale.deleteMany({
      where: {
        statisticsId: data.id,
      },
    });
  }

  async getTotalTXCShared(memberId: string) {
    const { _sum: data } = await this.prisma.memberStatistics.aggregate({
      _sum: {
        txcShared: true,
      },
      where: {
        memberId,
      },
    });

    return data;
  }

  async getMemberStatistic(query: Prisma.MemberStatisticsFindFirstArgs) {
    return this.prisma.memberStatistics.findFirst(query);
  }
}