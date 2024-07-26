import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';
import { CreateMemberWalletInput, MemberWalletQueryArgs } from './memberWallet.type';

@Service()
export class MemberWalletService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}
  async getMemberWallets(params: MemberWalletQueryArgs) {
    return await this.prisma.memberWallet.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getMemberWalletsCount(params: MemberWalletQueryArgs): Promise<number> {
    return this.prisma.memberWallet.count({ where: params.where });
  }

  async getMemberWalletById(id: string) {
    return this.prisma.memberWallet.findUnique({
      where: {
        id,
      },
    });
  }

  async createMemberWallet(data: CreateMemberWalletInput) {
    return this.prisma.memberWallet.create({
      data,
    });
  }
}
