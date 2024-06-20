import { Prisma } from '@prisma/client';
import { MEMBERS } from '../consts';

export const memberStatisticsData: Prisma.MemberStatisticsCreateManyInput[] = [
  {
    username: MEMBERS[0],
    txcShared: 38100,
    hashPower: 500,
    issuedAt: new Date('2024-06-13'),
    createdAt: new Date('2024-06-13'),
  },
  {
    username: MEMBERS[0],
    txcShared: 38100,
    hashPower: 500,
    issuedAt: new Date('2024-06-14'),
    createdAt: new Date('2024-06-14'),
  },
  {
    username: MEMBERS[0],
    txcShared: 38100,
    hashPower: 1000,
    issuedAt: new Date('2024-06-15'),
    createdAt: new Date('2024-06-15'),
  },
  {
    username: MEMBERS[0],
    txcShared: 38100,
    hashPower: 1500,
    issuedAt: new Date('2024-06-16'),
    createdAt: new Date('2024-06-16'),
  },
  {
    username: MEMBERS[1],
    txcShared: 38100,
    hashPower: 500,
    issuedAt: new Date('2024-06-13'),
    createdAt: new Date('2024-06-13'),
  },
  {
    username: MEMBERS[1],
    txcShared: 38100,
    hashPower: 500,
    issuedAt: new Date('2024-06-14'),
    createdAt: new Date('2024-06-14'),
  },
  {
    username: MEMBERS[1],
    txcShared: 38100,
    hashPower: 1000,
    issuedAt: new Date('2024-06-15'),
    createdAt: new Date('2024-06-15'),
  },
  {
    username: MEMBERS[1],
    txcShared: 38100,
    hashPower: 1500,
    issuedAt: new Date('2024-06-16'),
    createdAt: new Date('2024-06-16'),
  },
];
