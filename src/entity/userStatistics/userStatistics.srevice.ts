import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateUserStatisticsInput, UserStatisticsQueryArgs } from './userStatistics.type';

@Service()
export class UserStatisticsService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) { }

  async getUserStatistics(params: UserStatisticsQueryArgs) {
    return this.prisma.userStatistics.findMany({
      include: { user: true },
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getUserStatisticsCount(params: UserStatisticsQueryArgs): Promise<number> {
    return this.prisma.userStatistics.count({ where: params.where });
  }

  async getUserStatisticsById(id: string) {
    return this.prisma.userStatistics.findUnique({
      where: {
        id,
      },
    });
  }

  async createUserStatistics(data: CreateUserStatisticsInput) {
    return this.prisma.userStatistics.create({
      data,
    });
  }
}
