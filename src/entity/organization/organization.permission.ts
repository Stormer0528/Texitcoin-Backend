import { Ctx, MiddlewareFn } from 'type-graphql';
import { Context } from '@/context';

export const organizationPermission: MiddlewareFn<Context> = async (
  { args, context: { user, prisma } },
  next
) => {
  if (!user.isAdmin) {
    // Filter out disabled organizations

    const orgIds = await prisma.organization.findMany({
      relationLoadStrategy: 'join',
      select: { id: true, userGroupAssignment: { select: { userId: true, deletedAt: true } } },
      where: {
        userGroupAssignment: { every: { userId: user.id, deletedAt: null } },
        deletedAt: null,
      },
    });

    (args.filter = args.filter || {}).id = { in: orgIds.map((org) => org.id) };
  }

  return next();
};
