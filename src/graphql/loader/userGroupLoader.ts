import DataLoader from 'dataloader';

import RootDataLoader from './';
import { UserGroup } from '@/entity/userGroup/userGroup.entity';
import { Organization } from '@/entity/organization/organization.entity';

export const userGroupForUserLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, UserGroup[]>(
    async (userIds: string[]) => {
      // Fetch user groups from the database based on the provided userIds
      const userGroupAssignments = await parent.prisma.userGroupAssignment.findMany({
        relationLoadStrategy: 'join',
        include: { userGroup: true },
        where: {
          userId: {
            in: userIds,
          },
        },
      });

      // Map the fetched user groups to their corresponding userIds
      const userGroupByUserMap: Record<string, UserGroup[]> = {};
      userGroupAssignments.forEach(({ userId, userGroup }) => {
        (userGroupByUserMap[userId] = userGroupByUserMap[userId] || []).push(userGroup);
      });

      // Return the user groups in the same order as the provided groupIds
      return userIds.map((userId) => userGroupByUserMap[userId] || []);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};

export const orgForUserGroupLoader = (parent: RootDataLoader) => {
  return new DataLoader<string, Organization>(
    async (userGroupIds: string[]) => {
      // Fetch user groups from the database based on the provided userIds
      const userGroupsWithOrg = await parent.prisma.userGroup.findMany({
        relationLoadStrategy: 'join',
        include: { organization: true },
        where: {
          id: {
            in: userGroupIds,
          },
        },
      });

      // Map the fetched user groups to their corresponding userIds
      const userGroupsWithOrgMap: Record<string, Organization> = {};
      userGroupsWithOrg.forEach(({ id, organization }) => {
        userGroupsWithOrgMap[id] = organization;
      });

      // Return the user groups in the same order as the provided groupIds
      return userGroupIds.map((id) => userGroupsWithOrgMap[id]);
    },
    {
      ...parent.dataLoaderOptions,
    }
  );
};
