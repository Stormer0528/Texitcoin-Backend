import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

export const adminData: Prisma.AdminCreateManyInput[] = [
  {
    username: 'vitalii',
    email: 'vitovodenko@gmail.com',
    password: hashSync('vitalii0528', 12),
  },
  {
    username: 'bobby',
    email: 'bobby@blockchainmint.com',
    password: hashSync('bobby20240624', 12),
  },
];
