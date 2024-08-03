import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Sale } from '@/entity/sale/sale.entity';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';
import { MemberWallet } from '@/entity/memberWallet/memberWallet.entity';
import { Member } from '@/entity/member/member.entity';

export const salesForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Sale[]>(
    async (memberIds: string[]) => {
      const membersWithSales = await parent.prisma.member.findMany({
        select: {
          id: true,
          sales: true,
        },
        where: { id: { in: memberIds } },
      });

      const membersWithSalesMap: Record<string, Sale[]> = {};
      membersWithSales.forEach(({ id, sales }) => {
        membersWithSalesMap[id] = sales;
      });

      return memberIds.map((id) => membersWithSalesMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const memberStatisticsForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatistics[]>(
    async (memberIds: string[]) => {
      const membersWithMemberStatistics = await parent.prisma.member.findMany({
        select: {
          id: true,
          statistics: true,
        },
        where: { id: { in: memberIds } },
      });

      const membersWithMemberStatisticsMap: Record<string, MemberStatistics[]> = {};
      membersWithMemberStatistics.forEach(({ id, statistics }) => {
        membersWithMemberStatisticsMap[id] = statistics;
      });

      return memberIds.map((id) => membersWithMemberStatisticsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const memberWalletsForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberWallet[]>(
    async (memberIds: string[]) => {
      const membersWithMemberWallets = await parent.prisma.member.findMany({
        select: {
          id: true,
          memberWallets: true,
        },
        where: { id: { in: memberIds } },
      });

      const membersWithMemberWalletsMap: Record<string, MemberWallet[]> = {};
      membersWithMemberWallets.forEach(({ id, memberWallets }) => {
        membersWithMemberWalletsMap[id] = memberWallets;
      });

      return memberIds.map((id) => membersWithMemberWalletsMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const sponsorForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Member>(
    async (memberIds: string[]) => {
      const membersWithSponsor = await parent.prisma.member.findMany({
        select: {
          id: true,
          sponsor: true,
        },
        where: { id: { in: memberIds } },
      });

      const membersWithSponsorMap: Record<string, Member> = {};
      membersWithSponsor.forEach(({ id, sponsor }) => {
        membersWithSponsorMap[id] = sponsor;
      });

      return memberIds.map((id) => membersWithSponsorMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const introduceMembersForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Member[]>(
    async (memberIds: string[]) => {
      const membersWithIntroduceMembers = await parent.prisma.member.findMany({
        select: {
          id: true,
          introduceMembers: true,
        },
        where: { id: { in: memberIds } },
      });

      const membersWithIntroduceMembersMap: Record<string, Member[]> = {};
      membersWithIntroduceMembers.forEach(({ id, introduceMembers }) => {
        membersWithIntroduceMembersMap[id] = introduceMembers;
      });

      return memberIds.map((id) => membersWithIntroduceMembersMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
