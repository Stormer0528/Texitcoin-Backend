import { Service, Inject } from 'typedi';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/service/prisma';

import { CreateAddressInput } from './address.type';

@Service()
export class AddressService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  // `addressableId` and `addressableType` are required field
  async getAddresses(
    query: Prisma.AddressWhereInput & { addressableId: string; addressableType: string }
  ) {
    return this.prisma.address.findMany({
      where: query,
    });
  }

  async createAddress(data: CreateAddressInput[]) {
    return this.prisma.address.createMany({
      data,
    });
  }
}
