import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

export const userData: Prisma.UserCreateManyInput[] = [
  {
    username: 'vitalii',
    email: 'vitovodenko@gmail.com',
    isAdmin: true,
    password: hashSync('123456789', 12),
  },
  {
    username: 'bobby',
    email: 'bobby@blockchainmint.com',
    isAdmin: true,
    password: hashSync('123456789', 12),
  },
];
