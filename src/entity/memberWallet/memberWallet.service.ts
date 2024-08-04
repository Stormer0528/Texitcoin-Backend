import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';
import {
  CreateMemberWalletInput,
  MemberWalletQueryArgs,
  UpdateMemberWalletInput,
} from './memberWallet.type';
import Bluebird from 'bluebird';

@Service()
export class MemberWalletService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}
  async getMemberWallets(params: MemberWalletQueryArgs) {
    return await this.prisma.memberWallet.findMany({
      where: {
        ...params.where,
        deletedAt: null,
      },
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getMemberWalletsCount(params: MemberWalletQueryArgs): Promise<number> {
    return this.prisma.memberWallet.count({
      where: {
        ...params.where,
        deletedAt: null,
      },
    });
  }

  async getMemberWalletById(id: string) {
    return this.prisma.memberWallet.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async updateManyMemberWallet(data: UpdateMemberWalletInput) {
    const sumPercent = data.wallets.reduce((prev, current) => prev + current.percent, 0);
    if (sumPercent !== 100) if (sumPercent !== 100) throw new Error('Sum of percent must be 100');

    await this.prisma.memberWallet.updateMany({
      where: {
        memberId: data.memberId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    await Bluebird.map(
      data.wallets,
      async (wallet) => {
        await this.prisma.memberWallet.upsert({
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
      },
      { concurrency: 10 }
    );
  }

  async createManyMemberWallets(data: CreateMemberWalletInput[]) {
    const sumPercent = data.reduce((prev, current) => prev + current.percent, 0);
    if (sumPercent !== 100) throw new Error('Sum of percent must be 100');
    return this.prisma.memberWallet.createMany({
      data,
    });
  }
}
