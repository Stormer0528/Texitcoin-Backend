import { Prisma } from '@prisma/client';
import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateBlockInput, BlockQueryArgs } from './block.type';

@Service()
export class BlockService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getBlocks(params: BlockQueryArgs) {
    return this.prisma.block.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getBlocksCount(params: BlockQueryArgs): Promise<number> {
    return this.prisma.block.count({ where: params.where });
  }

  async getBlockById(id: string) {
    return this.prisma.block.findUnique({
      where: {
        id,
      },
    });
  }

  async getBlocksByDate(params: BlockQueryArgs) {
    const {
      filter: { period },
    } = params;

    return this.prisma.block.groupBy({
      where: { OR: [{ createdAt: { gte: period[0] } }, { createdAt: { lte: period[1] } }] },
      by: ['issuedAt'],
      _count: {
        _all: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async createBlock(data: CreateBlockInput) {
    return this.prisma.block.create({
      data,
    });
  }
}
