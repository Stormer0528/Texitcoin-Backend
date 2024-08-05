import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';
import { FromToQueryArgs, MemberStatisticsWalletQueryArgs } from './memberStatisticsWallet.type';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';
import { Prisma } from '@prisma/client';
import { Statistics } from '../statistics/statistics.entity';
import Bluebird from 'bluebird';
import { stringify } from 'querystring';
import { MemberWallet } from '../memberWallet/memberWallet.entity';

@Service()
export class MemberStatisticsWalletService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
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
          issuedAt: data.issuedAt,
        };
      });

    return this.prisma.memberStatisticsWallet.createMany({
      data: memberStatisticsWalletData,
    });
  }

  async createMemberStatisticsWalletByStatistic(data: Statistics) {
    const memberStatistics = await this.prisma.memberStatistics.findMany({
      where: {
        statisticsId: data.id,
      },
    });

    await Bluebird.map(
      memberStatistics,
      async (memberStatistic) => {
        await this.createMemberStatisticsWalletByMemberStatistic(memberStatistic);
      },
      { concurrency: 10 }
    );
  }

  async getRewardsByWallets(data: FromToQueryArgs & { memberId: string }) {
    const memberWallets = await this.prisma.memberWallet.findMany({
      where: {
        memberId: data.memberId,
      },
      include: {
        payout: true,
      },
    });
    const memberWalletsMap: Record<string, MemberWallet> = {};
    memberWallets.forEach((memberWallet) => {
      memberWalletsMap[memberWallet.id] = memberWallet;
    });

    const rewardsByMemberWallets = await this.prisma.memberStatisticsWallet.groupBy({
      by: ['memberWalletId'],
      where: {
        issuedAt: {
          gte: data.from,
          lte: data.to,
        },
        memberWalletId: {
          in: Object.keys(memberWalletsMap),
        },
      },
      _sum: {
        txc: true,
      },
    });
    return rewardsByMemberWallets.map((reward) => ({
      wallet: memberWalletsMap[reward.memberWalletId],
      txc: reward._sum.txc,
    }));
  }
}
