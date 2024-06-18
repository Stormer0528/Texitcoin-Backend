import { MineStatInput, SaleReport, SaleReportInput } from '@/type';
import { Statistics } from '@/entity/statistics/statistics.entity';
import { toLocaleDate } from './common';
import { User } from '../entity/user/user.entity';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getSalesGroupByDate = function (saleReports: SaleReportInput[]): Record<string, SaleReport> {
  const salesGroupByDate: Record<string, SaleReport> = {};

  saleReports.forEach(({ hashPower, amount, email, date }) => {
    const formattedDate = toLocaleDate(date, 'en-CA');

    if (!salesGroupByDate[formattedDate]) {
      salesGroupByDate[formattedDate] = { hashPower: 0, amount: 0, member: {} };
    }

    salesGroupByDate[formattedDate].hashPower += hashPower;
    salesGroupByDate[formattedDate].amount += amount;
    salesGroupByDate[formattedDate].member[email] =
      (salesGroupByDate[formattedDate].member[email] || 0) + hashPower;
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
    const members: Record<string, number> = salesGroupByDate[formattedDate].member;

    Object.entries(members).forEach(async ([email, hashPower]) => {
      if (!users[email]) {
        const user: User = await prisma.user.findUnique({ where: { email } });
        users[email] = user.id;
      }

      userStatistics.push({
        userId: users[email],
        issuedAt: date,
        createdAt: date,
        txcShared: (newBlocks * hashPower * 254) / salesGroupByDate[formattedDate].hashPower,
        hashPower: hashPower,
      });
    });
  });

  return userStatistics;
};
