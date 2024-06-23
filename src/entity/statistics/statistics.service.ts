import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateStatisticsInput, StatisticsQueryArgs } from './statistics.type';
import { Member } from '../member/member.entity';

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

  async updateStatistics(issuedAt: Date) {
    return this.prisma.statistics.findFirst({ where: { issuedAt } }).then((statistics) => {
      return this.prisma.statistics.update({
        where: {
          id: statistics.id,
        },
        data: {
          status: true,
        },
        include: {
          memberStatistics: {
            include: {
              member: true,
            },
          },
        },
      });
    });
  }
}
