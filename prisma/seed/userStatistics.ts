import { Prisma } from '@prisma/client';
import { USERS } from '../consts';

export const userStatisticsData: Prisma.UserStatisticsCreateManyInput[] = [
  {
    userId: USERS[0],
    txcShared: 38100,
    hashPower: 500,
    issuedAt: new Date('2024-06-13'),
    createdAt: new Date('2024-06-13'),
  },
  {
    userId: USERS[0],
    txcShared: 38100,
    hashPower: 500,
    issuedAt: new Date('2024-06-14'),
    createdAt: new Date('2024-06-14'),
  },
  {
    userId: USERS[0],
    txcShared: 38100,
    hashPower: 1000,
    issuedAt: new Date('2024-06-15'),
    createdAt: new Date('2024-06-15'),
  },
  {
    userId: USERS[0],
    txcShared: 38100,
    hashPower: 1500,
    issuedAt: new Date('2024-06-16'),
    createdAt: new Date('2024-06-16'),
  },
  {
    userId: USERS[1],
    txcShared: 38100,
    hashPower: 500,
    issuedAt: new Date('2024-06-13'),
    createdAt: new Date('2024-06-13'),
  },
  {
    userId: USERS[1],
    txcShared: 38100,
    hashPower: 500,
    issuedAt: new Date('2024-06-14'),
    createdAt: new Date('2024-06-14'),
  },
  {
    userId: USERS[1],
    txcShared: 38100,
    hashPower: 1000,
    issuedAt: new Date('2024-06-15'),
    createdAt: new Date('2024-06-15'),
  },
  {
    userId: USERS[1],
    txcShared: 38100,
    hashPower: 1500,
    issuedAt: new Date('2024-06-16'),
    createdAt: new Date('2024-06-16'),
  },
];
