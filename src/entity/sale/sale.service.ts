import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateSaleInput, SaleQueryArgs } from './sale.type';

@Service()
export class SaleService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}
  async getSales(params: SaleQueryArgs) {
    return await this.prisma.sale.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getSalesCount(params: SaleQueryArgs): Promise<number> {
    return this.prisma.sale.count({ where: params.where });
  }

  async getSaleById(id: string) {
    return this.prisma.sale.findUnique({
      where: {
        id,
      },
    });
  }

  async createSale(data: CreateSaleInput) {
    return this.prisma.sale.create({
      data,
    });
  }
}
