import { MineStatInput, SaleReport, SaleReportInput } from '@/type';
import { Statistics } from '@/entity/statistics/statistics.entity';
import { formatDate } from './common';
import { Member, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getSalesGroupByDate = function (saleReports: SaleReportInput[]): Record<string, SaleReport> {
  const salesGroupByDate: Record<string, SaleReport> = {};

  saleReports.forEach(({ hashPower, amount, username, issuedAt }) => {
    const formattedDate = formatDate(issuedAt);

    if (!salesGroupByDate[formattedDate]) {
      salesGroupByDate[formattedDate] = { hashPower: 0, amount: 0, member: {} };
    }

    salesGroupByDate[formattedDate].hashPower += hashPower;
    salesGroupByDate[formattedDate].amount += amount;
    salesGroupByDate[formattedDate].member[username] =
      (salesGroupByDate[formattedDate].member[username] || 0) + hashPower;
  });

  return salesGroupByDate;
};

export const processStatistics = async function (
  saleReports: SaleReportInput[],
  mineStats: MineStatInput
): Promise<Prisma.StatisticsCreateManyInput[]> {
  const { newBlocks, issuedAt } = mineStats;
  const statistics: Prisma.StatisticsCreateManyInput[] = [];
  const salesGroupByDate: Record<string, SaleReport> = getSalesGroupByDate(saleReports);
  let from: Date = null,
    to: Date = null;
  saleReports.forEach(({ issuedAt }) => {
    if (!from) from = issuedAt;
    else if (from > issuedAt) from = issuedAt;
    if (!to) to = issuedAt;
    else if (to < issuedAt) to = issuedAt;
  });
  const prevStatistic: Statistics = await prisma.statistics.findFirst({
    orderBy: {
      issuedAt: 'desc',
    },
  });

  let { totalBlocks, totalHashPower } = prevStatistic
    ? prevStatistic
    : { totalBlocks: 0, totalHashPower: 0 };

  const formattedDate: string = formatDate(issuedAt);

  if (!salesGroupByDate[formattedDate]) {
    salesGroupByDate[formattedDate] = { hashPower: 0, amount: 0, member: {} };
  }

  totalHashPower += salesGroupByDate[formattedDate].hashPower;

  statistics.push({
    issuedAt: new Date(formattedDate),
    createdAt: issuedAt,
    newBlocks,
    totalBlocks,
    newHashPower: salesGroupByDate[formattedDate].hashPower,
    totalHashPower,
    members: Object.keys(salesGroupByDate[formattedDate].member).length,
    from,
    to,
  });

  return statistics;
};

export const processMemberStatistics = async function (
  saleReports: SaleReportInput[],
  mineStats: MineStatInput
): Promise<Prisma.MemberStatisticsCreateManyInput[]> {
  const { newBlocks, issuedAt } = mineStats;
  const memberStatistics: Prisma.MemberStatisticsCreateManyInput[] = [];
  const salesGroupByDate: Record<string, SaleReport> = getSalesGroupByDate(saleReports);
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
