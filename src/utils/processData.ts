import { PrismaClient, Sale } from '@prisma/client';

const prisma = new PrismaClient();

export const processStatistics = async function (sales: Sale[]) {
  const saleStatistics = await sales.reduce(
    async (promisePrev, { packageId, memberId }) => {
      const prev = await promisePrev;
      const { token: hashPower } = await prisma.package.findUnique({
        select: {
          token: true,
        },
        where: {
          id: packageId,
        },
      });
      return {
        ...prev,
        members: { ...prev.members, [memberId]: (prev.members[memberId] || 0) + hashPower },
        hashPower: prev.hashPower + hashPower,
      };
    },
    Promise.resolve({ hashPower: 0, members: {} })
  );

  return {
    totalHashPower: saleStatistics.hashPower,
    totalMembers: Object.keys(saleStatistics.members).length,
  };
};
