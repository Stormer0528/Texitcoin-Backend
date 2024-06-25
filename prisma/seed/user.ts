import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

export const userData: Prisma.UserCreateManyInput[] = [
  {
    username: 'vitalii',
    email: 'vitovodenko@gmail.com',
    isAdmin: true,
    password: hashSync('vitalii0528', 12),
  },
  {
    username: 'bobby',
    email: 'bobby@blockchainmint.com',
    isAdmin: true,
    password: hashSync('bobby20240624', 12),
  },
];
