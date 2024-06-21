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
    const allItems = await this.prisma.sale.findMany({
      include: { member: true },
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
    return allItems;
  }
  async getSalesGroupByDate(params: SaleQueryArgs) {
    const allItems = await this.prisma.sale.findMany({
      include: { member: true },
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });

    const result = await this.prisma.sale.groupBy({
      by: ['issuedAt'],
      _sum: {
        hashPower: true,
      },
      where: params.where,
      orderBy: { issuedAt: 'desc' },
      ...params.parsePage,
    });

    return result;
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
