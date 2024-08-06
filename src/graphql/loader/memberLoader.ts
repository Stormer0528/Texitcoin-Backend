import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Sale } from '@/entity/sale/sale.entity';
import { MemberStatistics } from '@/entity/memberStatistics/memberStatistics.entity';
import { MemberWallet } from '@/entity/memberWallet/memberWallet.entity';
import { Member } from '@/entity/member/member.entity';

export const salesForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Sale[]>(
    async (memberIds: string[]) => {
      const sales = await parent.prisma.sale.findMany({
        where: {
          memberId: {
            in: memberIds,
          },
        },
      });
      const membersWithSalesMap: Record<string, Sale[]> = {};
      sales.forEach((sale) => {
        if (!membersWithSalesMap[sale.memberId]) membersWithSalesMap[sale.memberId] = [];
        membersWithSalesMap[sale.memberId].push(sale);
      });

      return memberIds.map((id) => membersWithSalesMap[id] ?? []);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const memberStatisticsForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberStatistics[]>(
    async (memberIds: string[]) => {
      const memberStatistics = await parent.prisma.memberStatistics.findMany({
        where: { memberId: { in: memberIds } },
      });

      const membersWithMemberStatisticsMap: Record<string, MemberStatistics[]> = {};
      memberStatistics.forEach((memberStatistics) => {
        if (!membersWithMemberStatisticsMap[memberStatistics.memberId])
          membersWithMemberStatisticsMap[memberStatistics.memberId] = [];
        membersWithMemberStatisticsMap[memberStatistics.memberId].push(memberStatistics);
      });

      return memberIds.map((id) => membersWithMemberStatisticsMap[id] ?? []);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const memberWalletsForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, MemberWallet[]>(
    async (memberIds: string[]) => {
      const memberWallets = await parent.prisma.memberWallet.findMany({
        where: { memberId: { in: memberIds }, deletedAt: null },
      });

      const memberWahlletsMap: Record<string, MemberWallet[]> = {};
      memberWallets.forEach((memberWallet) => {
        if (!memberWahlletsMap[memberWallet.memberId])
          memberWahlletsMap[memberWallet.memberId] = [];
        memberWahlletsMap[memberWallet.memberId].push(memberWallet);
      });

      return memberIds.map((id) => memberWahlletsMap[id] ?? []);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const sponsorForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Member>(
    async (sponsorIds: string[]) => {
      const uniqueSponsorIds = [...new Set(sponsorIds)];
      const sponsors = await parent.prisma.member.findMany({
        where: { id: { in: uniqueSponsorIds } },
      });

      const sponsorMap: Record<string, Member> = {};
      sponsors.forEach((sponsor) => {
        sponsorMap[sponsor.id] = sponsor;
      });

      return uniqueSponsorIds.map((id) => sponsorMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const introduceMembersForMemberLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Member[]>(
    async (memberIds: string[]) => {
      const introduceMembers = await parent.prisma.member.findMany({
        where: { sponsorId: { in: memberIds } },
      });

      const introduceMembersMap: Record<string, Member[]> = {};

      introduceMembers.forEach((introducer) => {
        if (!introduceMembersMap[introducer.sponsorId])
          introduceMembersMap[introducer.sponsorId] = [];
        introduceMembersMap[introducer.sponsorId].push(introducer);
      });

      return memberIds.map((id) => introduceMembersMap[id] ?? []);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
