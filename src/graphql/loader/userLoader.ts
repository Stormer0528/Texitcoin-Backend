import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { User } from '@/entity/user/user.entity';

export const userForOrganizationLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, User[]>(
    async (orgIds: string[]) => {
      // Fetch user groups from the database based on the provided userIds
      const orgWithUsers = await parent.prisma.organization.findMany({
        relationLoadStrategy: 'join',
        select: {
          id: true,
          userGroupAssignment: {
            where: { deletedAt: null, user: { deletedAt: null } },
            select: { user: true },
          },
        },
        where: { id: { in: orgIds } },
      });

      // Map the fetched user groups to their corresponding userIds
      const userForOrgMap: Record<string, User[]> = {};
      orgWithUsers.forEach(({ id, userGroupAssignment }) => {
        if (!userGroupAssignment) {
          return;
        }

        userForOrgMap[id] = userGroupAssignment.map(({ user }) => user).filter((user) => user);
      });

      // Return the user groups in the same order as the provided groupIds
      return orgIds.map((id) => userForOrgMap[id] || []);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
