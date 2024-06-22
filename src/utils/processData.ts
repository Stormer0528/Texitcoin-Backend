import { SaleReport, SaleReportInput } from '@/type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const formatGroupByDate = function (saleReports: SaleReportInput[]): SaleReport {
  const sales = saleReports.reduce(
    (prev, { hashPower, username }) => ({
      ...prev,
      members: { ...prev.members, [username]: prev.members[username] || 0 + hashPower },
      hashPower: prev.hashPower + hashPower,
    }),
    { hashPower: 0, members: {} }
  );

  return sales;
};

export const processStatistics = async function (saleReports: SaleReportInput[]) {
  const sales: SaleReport = formatGroupByDate(saleReports);

  return {
    newHashPower: sales.hashPower,
    members: Object.keys(sales.members).length,
  };
};

export const processMemberStatistics = async function (saleReports: SaleReportInput[]) {
  const sales: SaleReport = formatGroupByDate(saleReports);

  const { id, issuedAt, newBlocks, newHashPower } = await prisma.statistics.findFirst({
    orderBy: { issuedAt: 'desc' },
  });

  const membersData = await prisma.member.findMany({
    where: { username: { in: Object.keys(sales.members) } },
  });

  const members = membersData.reduce((prev, { id, username }) => ({ ...prev, [username]: id }), {});

  const memberStatistics = Object.entries(sales.members).map(([username, hashPower]) => ({
    memberId: members[username],
    statisticsId: id,
    issuedAt,
    txcShared: Number(((newBlocks * hashPower * 254) / newHashPower).toFixed(3)),
    hashPower,
    percent: Number(((hashPower * 100) / newHashPower).toFixed(3)),
  }));

  return memberStatistics;
};
