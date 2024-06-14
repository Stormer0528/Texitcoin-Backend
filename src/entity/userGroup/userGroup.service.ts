import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateUserGroupInput, UpdateUserGroupInput } from './userGroup.type';

@Service()
export class UserGroupService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getOrgUserGroups(orgId: string) {
    return this.prisma.userGroup.findMany({ where: { organizationId: orgId } });
  }

  async createOrg(data: CreateUserGroupInput) {
    return this.prisma.userGroup.create({
      data,
    });
  }

  async updateOrg(data: UpdateUserGroupInput) {
    return this.prisma.userGroup.update({
      where: { id: data.id },
      data,
    });
  }

  async getOrganization(id: string) {
    return this.prisma.userGroup.findUnique({ where: { id } }).organization();
  }

  async getUserGroupsByUser(userId: string) {
    return this.prisma.userGroup.findMany({
      relationLoadStrategy: 'join',
      include: { userGroupAssignment: true },
      where: {
        userGroupAssignment: {
          some: {
            id: userId,
          },
        },
      },
    });
  }
}
