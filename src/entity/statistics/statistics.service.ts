import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { ConfirmStatistics, CreateStatisticsInput, StatisticsQueryArgs } from './statistics.type';

@Service()
export class StatisticsService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getStatistics(params: StatisticsQueryArgs) {
    return this.prisma.statistics.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getPendingStatistics(date: Date) {
    return this.prisma.statistics.findFirst({
      include: {
        memberStatistics: {
          include: {
            member: true,
          },
        },
      },
      where: {
        status: false,
        issuedAt: date,
      },
    });
  }

  async getLatestStatistics() {
    // TODO: `to` should be renamed to `endBlockTime`
    return this.prisma.statistics.findFirst({ orderBy: { to: 'desc' } });
  }

  async getStatisticsById(id: string) {
    return this.prisma.statistics.findUnique({ where: { id } });
  }

  async createStatistics(data: CreateStatisticsInput) {
    return this.prisma.statistics.create({ data });
  }

  async updateStatistics(data: ConfirmStatistics) {
    return this.prisma.statistics.updateMany({
      where: {
        id: data.id,
        status: false,
      },
      data: {
        status: true,
      },
    });
  }
}
