import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';
import {
  CreateMemberStatisticsWalletInput,
  MemberStatisticsWalletQueryArgs,
} from './memberStatisticsWallet.type';

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

  async createMemberStatisticsWallet(data: CreateMemberStatisticsWalletInput) {
    return this.prisma.memberStatisticsWallet.create({
      data,
    });
  }
}
