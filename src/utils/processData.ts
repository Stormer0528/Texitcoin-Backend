import { MineStatInput, SaleReport, SaleReportInput } from '@/type';
import { formatDate } from './common';
import { Member, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSalesGroupByDate = function (saleReports: SaleReportInput[]): SaleReport {
  const sales = saleReports.reduce(
    (prev, { hashPower, username }) => ({
      ...prev,
      members: { [username]: prev.members[username] || 0 + hashPower },
      hashPower: prev.hashPower + hashPower,
    }),
    { hashPower: 0, members: {} }
  );

  return sales;
};

export const processStatistics = async function (saleReports: SaleReportInput[]) {
  const sales: SaleReport = getSalesGroupByDate(saleReports);

  return {
    newHashPower: sales.hashPower,
    members: Object.keys(sales.members).length,
  };
};

export const processMemberStatistics = async function (
  saleReports: SaleReportInput[],
  mineStats: MineStatInput
): Promise<Prisma.MemberStatisticsCreateManyInput[]> {
  const { newBlocks, issuedAt } = mineStats;
  const memberStatistics: Prisma.MemberStatisticsCreateManyInput[] = [];
  const salesGroupByDate: any = getSalesGroupByDate(saleReports);
  const users: Record<string, string> = {};

  const formattedDate: string = formatDate(issuedAt);
  const statistics = await prisma.statistics.findFirst({
    where: { issuedAt: new Date(formattedDate) },
  });

  if (!salesGroupByDate[formattedDate]) {
    salesGroupByDate[formattedDate] = { hashPower: 0, amount: 0, member: {} };
  }

  const members: Record<string, number> = salesGroupByDate[formattedDate].member;

  Object.entries(members).forEach(async ([username, hashPower]) => {
    if (!users[username]) {
      const user: Member = await prisma.member.findUnique({ where: { username } });
      users[username] = user.id;
    }

    memberStatistics.push({
      memberId: users[username],
      statisticsId: statistics.id,
      issuedAt,
      createdAt: issuedAt,
      txcShared: (newBlocks * hashPower * 254) / salesGroupByDate[formattedDate].hashPower,
      hashPower,
      percent: (hashPower * 100) / salesGroupByDate[formattedDate].hashPower,
    });
  });

  return memberStatistics;
};
