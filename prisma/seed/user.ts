import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

export const userData: Prisma.UserCreateManyInput[] = [
  {
    username: 'vitalii',
    email: 'vitovodenko@gmail.com',
    isAdmin: false,
    password: hashSync('123456789', 12),
  },
  {
    username: 'finix',
    email: 'goldenfinix@outlook.com',
    isAdmin: false,
    password: hashSync('123456789', 12),
  },
  {
    username: 'temp',
    email: 'temp@outlook.com',
    password: hashSync('123456789', 12),
    isAdmin: false,
  },
];
