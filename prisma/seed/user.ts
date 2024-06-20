import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

export const userData: Prisma.UserCreateManyInput[] = [
  {
    username: 'finix',
    email: 'goldenfinix@outlook.com',
    isAdmin: true,
    password: hashSync('123456789', 12),
  },
  {
    username: 'temp',
    email: 'temp@outlook.com',
    password: hashSync('123456789', 12),
  },
];
