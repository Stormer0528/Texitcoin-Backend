import { Prisma } from '@prisma/client';
import { STATISTICS } from '../consts';

export const statisticsData: Prisma.StatisticsCreateManyInput[] = [
  {
    id: STATISTICS[0],
    newBlocks: 300,
    totalBlocks: 300,
    newHashPower: 1000,
    totalHashPower: 1000,
    members: 2,
    issuedAt: new Date('2024-06-13'),
    createdAt: new Date('2024-06-13'),
  },
  {
    id: STATISTICS[1],
    newBlocks: 300,
    totalBlocks: 600,
    newHashPower: 1000,
    totalHashPower: 2000,
    members: 2,
    issuedAt: new Date('2024-06-14'),
    createdAt: new Date('2024-06-14'),
  },
  {
    id: STATISTICS[2],
    newBlocks: 300,
    totalBlocks: 900,
    newHashPower: 2000,
    totalHashPower: 4000,
    members: 2,
    issuedAt: new Date('2024-06-15'),
    createdAt: new Date('2024-06-15'),
  },
  {
    id: STATISTICS[3],
    newBlocks: 300,
    totalBlocks: 1200,
    newHashPower: 3000,
    totalHashPower: 7000,
    members: 2,
    issuedAt: new Date('2024-06-16'),
    createdAt: new Date('2024-06-16'),
  },
];
