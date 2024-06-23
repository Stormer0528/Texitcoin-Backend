import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateStatisticsInput, StatisticsQueryArgs } from './statistics.type';

@Service()
export class StatisticsService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getStatistics(params: StatisticsQueryArgs) {
    return this.prisma.statistics.findMany({
      include: {
        memberStatistics: {
          include: {
            member: true,
          },
        },
      },
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getStatisticsById(id: string) {
    return this.prisma.statistics.findUnique({ where: { id } });
  }

  async createStatistics(data: CreateStatisticsInput) {
    return this.prisma.statistics.create({ data });
  }
}
