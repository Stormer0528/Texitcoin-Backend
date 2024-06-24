import type { IncomingMessage } from 'http';
import { StandaloneServerContextFunctionArgument } from '@apollo/server/dist/esm/standalone';
import { ContextFunction } from '@apollo/server';
import { PrismaClient, User } from '@prisma/client';

import { verifyToken } from '@/utils/auth';

const prisma = new PrismaClient({ log: ['query'] });

export interface Context {
  user?: User;
  prisma: PrismaClient;
  req: IncomingMessage;
}

export const context: ContextFunction<[StandaloneServerContextFunctionArgument], Context> = async ({
  req,
}): Promise<Context> => {
  const token = req.headers.authorization?.split(' ')[1];
  let user: User;
  if (token) {
    const payload = verifyToken(token) as any;

    user = await prisma.user.findUnique({ where: { id: payload.id } });
  }

  return {
    user,
    req,
    prisma,
  };
};
