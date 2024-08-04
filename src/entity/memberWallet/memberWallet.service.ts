import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';
import {
  CreateMemberWalletInput,
  MemberWalletQueryArgs,
  UpdateMemberWalletInput,
} from './memberWallet.type';

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

  async updateManyMemberWallet(data: UpdateMemberWalletInput) {
    await this.prisma.memberWallet.updateMany({
      where: {
        memberId: data.memberId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    data.wallets.forEach((wallet) => {
      this.prisma.memberWallet.upsert({
        where: {
          memberId_payoutId_address: {
            memberId: data.memberId,
            address: wallet.address,
            payoutId: wallet.payoutId,
          },
        },
        update: {
          ...wallet,
          deletedAt: null,
        },
        create: {
          ...wallet,
          memberId: data.memberId,
        },
      });
    });
  }

  async createManyMemberWallets(data: CreateMemberWalletInput[]) {
    return this.prisma.memberWallet.createMany({
      data,
    });
  }
}
