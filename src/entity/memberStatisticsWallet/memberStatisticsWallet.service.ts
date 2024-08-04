import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';
import {
  CreateMemberStatisticsWalletInput,
  MemberStatisticsWalletQueryArgs,
} from './memberStatisticsWallet.type';
import { MemberStatistics } from '../memberStatistics/memberStatistics.entity';
import { Prisma } from '@prisma/client';

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

  async createMemberStatisticsWallet(data: MemberStatistics) {
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
}
