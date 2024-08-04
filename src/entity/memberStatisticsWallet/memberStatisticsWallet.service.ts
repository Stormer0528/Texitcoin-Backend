import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';
import { MemberStatisticsWalletQueryArgs } from './memberStatisticsWallet.type';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';
import { Prisma } from '@prisma/client';
import { Statistics } from '../statistics/statistics.entity';
import { MemberStatisticsService } from '../memberStatistics/memberStatistics.service';
import Bluebird from 'bluebird';

@Service()
export class MemberStatisticsWalletService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService,
    private readonly memberStatisticsService: MemberStatisticsService
  ) {}
  async getMemberStatisticsWallets(params: MemberStatisticsWalletQueryArgs) {
    return await this.prisma.memberStatisticsWallet.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getMemberStatisticsWalletCount(params: MemberStatisticsWalletQueryArgs): Promise<number> {
    return this.prisma.memberStatisticsWallet.count({ where: params.where });
  }

  async getMemberStatisticsWalletById(id: string) {
    return this.prisma.memberStatisticsWallet.findUnique({
      where: {
        id,
      },
    });
  }

  async createMemberStatisticsWalletByMemberStatistic(data: MemberStatistics) {
    const memberWallets = await this.prisma.memberWallet.findMany({
      where: {
        memberId: data.memberId,
        deletedAt: null,
      },
    });
    const memberStatisticsWalletData: Prisma.MemberStatisticsWalletUncheckedCreateInput[] =
      memberWallets.map((wallet) => {
        return {
          memberStatisticId: data.id,
          memberWalletId: wallet.id,
          txc: (data.txcShared * wallet.percent) / 100,
        };
      });

    return this.prisma.memberStatisticsWallet.createMany({
      data: memberStatisticsWalletData,
    });
  }

  async createMemberStatisticsWalletByStatistic(data: Statistics) {
    const memberStatistics = await this.memberStatisticsService.getMemberStatisticsByQuery({
      statisticsId: data.id,
    });

    await Bluebird.map(
      memberStatistics,
      async (memberStatistic) => {
        await this.createMemberStatisticsWalletByMemberStatistic(memberStatistic);
      },
      { concurrency: 10 }
    );
  }
}
