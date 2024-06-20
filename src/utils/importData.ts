import { MineStatInput, SaleReport, SaleReportInput } from '@/type';
import { Statistics } from '@/entity/statistics/statistics.entity';
import { formatDate } from './common';
import { User } from '../entity/user/user.entity';
import { Prisma, PrismaClient } from '@prisma/client';

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
  });

  return statistics;
};

export const processUserStatistics = async function (
  saleReports: SaleReportInput[],
  mineStats: MineStatInput
): Promise<Prisma.UserStatisticsCreateManyInput[]> {
  const { newBlocks, issuedAt } = mineStats;
  const userStatistics: Prisma.UserStatisticsCreateManyInput[] = [];
  const salesGroupByDate: Record<string, SaleReport> = getSalesGroupByDate(saleReports);
  const users: Record<string, string> = {};

  const formattedDate: string = formatDate(issuedAt);

  if (!salesGroupByDate[formattedDate]) {
    salesGroupByDate[formattedDate] = { hashPower: 0, amount: 0, member: {} };
  }

  const members: Record<string, number> = salesGroupByDate[formattedDate].member;

  Object.entries(members).forEach(async ([username, hashPower]) => {
    if (!users[username]) {
      const user: User = await prisma.user.findUnique({ where: { username } });
      users[username] = user.username;
    }

    userStatistics.push({
      username: users[username],
      issuedAt,
      createdAt: issuedAt,
      txcShared: (newBlocks * hashPower * 254) / salesGroupByDate[formattedDate].hashPower,
      hashPower,
    });
  });

  return userStatistics;
};
