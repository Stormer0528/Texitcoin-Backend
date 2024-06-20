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
  const { newBlocks, difficulty = 0, issuedAt } = mineStats;
  const statistics: Prisma.StatisticsCreateManyInput[] = [];
  const salesGroupByDate: Record<string, SaleReport> = getSalesGroupByDate(saleReports);

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

  const hashRate = Number(((difficulty * Math.pow(2, 32)) / 600 / Math.pow(10, 9)).toFixed(3));

  statistics.push({
    issuedAt: new Date(formattedDate),
    createdAt: issuedAt,
    newBlocks,
    totalBlocks,
    difficulty,
    hashRate,
    newHashPower: salesGroupByDate[formattedDate].hashPower,
    totalHashPower,
    members: Object.keys(salesGroupByDate[formattedDate].member).length,
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

  if (!salesGroupByDate[formattedDate]) {
    salesGroupByDate[formattedDate] = { hashPower: 0, amount: 0, member: {} };
  }

  const members: Record<string, number> = salesGroupByDate[formattedDate].member;

  Object.entries(members).forEach(async ([username, hashPower]) => {
    if (!users[username]) {
      const user: Member = await prisma.member.findUnique({ where: { username } });
      users[username] = user.username;
    }

    memberStatistics.push({
      username: users[username],
      issuedAt,
      createdAt: issuedAt,
      txcShared: (newBlocks * hashPower * 254) / salesGroupByDate[formattedDate].hashPower,
      hashPower,
    });
  });

  return memberStatistics;
};
