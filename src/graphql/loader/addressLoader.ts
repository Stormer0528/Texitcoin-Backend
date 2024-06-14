import DataLoader from 'dataloader';

import RootDataLoader from '.';

import { Address } from '@/entity/address/address.entity';
import { AddressPolymorphic } from '@/entity/address/address.type';

export const addressLoader = (parent: RootDataLoader) => {
  return new DataLoader<AddressPolymorphic, Address[]>(
    async (query: AddressPolymorphic[]) => {
      // Fetch user groups from the database based on the provided userIds
      const addresses = await parent.prisma.address.findMany({
        where: {
          addressableType: query[0].addressableType,
          addressableId: { in: query.map((q) => q.addressableId) },
        },
      });

      // Map the fetched user groups to their corresponding userIds
      const addressMap: Record<string, Address[]> = {};
      addresses.forEach((address) => {
        (addressMap[address.addressableId] = addressMap[address.addressableId] || []).push(address);
      });

      // Return the user groups in the same order as the provided groupIds
      return query.map((q) => addressMap[q.addressableId] || []);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
