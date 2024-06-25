import { Sale } from '@prisma/client';

export const processStatistics = async function (sales: Sale[]) {
  const saleStatistics = sales.reduce(
    (prev, { hashPower, memberId }) => ({
      ...prev,
      members: { ...prev.members, [memberId]: (prev.members[memberId] || 0) + hashPower },
      hashPower: prev.hashPower + hashPower,
    }),
    { hashPower: 0, members: {} }
  );

  return {
    totalHashPower: saleStatistics.hashPower,
    totalMembers: Object.keys(saleStatistics.members).length,
  };
};
