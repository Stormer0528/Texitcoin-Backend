import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';
import { CreatePaymentInput, PaymentQueryArgs } from './payment.type';

@Service()
export class PaymentService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}
  async getPayments(params: PaymentQueryArgs) {
    return await this.prisma.payment.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getPaymentsCount(params: PaymentQueryArgs): Promise<number> {
    return this.prisma.payment.count({ where: params.where });
  }

  async getPaymentById(id: string) {
    return this.prisma.payment.findUnique({
      where: {
        id,
      },
    });
  }

  async createPayment(data: CreatePaymentInput) {
    return this.prisma.payment.create({
      data,
    });
  }
}
