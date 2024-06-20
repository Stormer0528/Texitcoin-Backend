import { MineStatInput, SaleReport, SaleReportInput } from '@/type';
import { Statistics } from '@/entity/statistics/statistics.entity';
import { toLocaleDate } from './common';
import { User } from '../entity/user/user.entity';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getSalesGroupByDate = function (saleReports: SaleReportInput[]): Record<string, SaleReport> {
  const salesGroupByDate: Record<string, SaleReport> = {};

  saleReports.forEach(({ hashPower, amount, username, date }) => {
    const formattedDate = toLocaleDate(date, 'en-CA');

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

export const getStatistics = async function (
  saleReports: SaleReportInput[],
  mineStats: MineStatInput[]
): Promise<Prisma.StatisticsCreateManyInput[]> {
  const statistics: Prisma.StatisticsCreateManyInput[] = [];
  const salesGroupByDate: Record<string, SaleReport> = getSalesGroupByDate(saleReports);

  const prevStatistic: Statistics = await prisma.statistics.findFirst({
    orderBy: {
      issuedAt: 'desc',
    },
  });

  let totalHashPower: number = prevStatistic ? prevStatistic.totalHashPower : 0;

  mineStats.forEach(({ date, newBlocks, totalBlocks }) => {
    const formattedDate: string = toLocaleDate(date, 'en-CA');

    if (!salesGroupByDate[formattedDate]) {
      salesGroupByDate[formattedDate] = { hashPower: 0, amount: 0, member: {} };
    }

    totalHashPower += salesGroupByDate[formattedDate].hashPower;

    statistics.push({
      issuedAt: date,
      createdAt: date,
      newBlocks,
      totalBlocks,
      newHashPower: salesGroupByDate[formattedDate].hashPower,
      totalHashPower,
      members: Object.keys(salesGroupByDate[formattedDate].member).length,
    });
  });

  return statistics;
};

export const getUserStatistics = async function (
  saleReports: SaleReportInput[],
  mineStats: MineStatInput[]
): Promise<Prisma.UserStatisticsCreateManyInput[]> {
  const userStatistics: Prisma.UserStatisticsCreateManyInput[] = [];
  const salesGroupByDate: Record<string, SaleReport> = getSalesGroupByDate(saleReports);
  const users: Record<string, string> = {};

  await mineStats.forEach(async ({ date, newBlocks }) => {
    const formattedDate: string = toLocaleDate(date, 'en-CA');

    if (!salesGroupByDate[formattedDate]) {
      salesGroupByDate[formattedDate] = { hashPower: 0, amount: 0, member: {} };
    }

    const members: Record<string, number> = salesGroupByDate[formattedDate].member;

    Object.entries(members).forEach(async ([username, hashPower]) => {
      if (!users[username]) {
        const user: User = await prisma.user.findUnique({ where: { username } });
        users[username] = user.id;
      }

      userStatistics.push({
        userId: users[username],
        issuedAt: date,
        createdAt: date,
        txcShared: (newBlocks * hashPower * 254) / salesGroupByDate[formattedDate].hashPower,
        hashPower,
      });
    });
  });

  return userStatistics;
};
