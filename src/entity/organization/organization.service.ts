import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateOrganizationInput, OrganizationQueryArgs } from './organization.type';

@Service()
export class OrganizationService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getOrganizations(params: OrganizationQueryArgs) {
    return this.prisma.organization.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getOrganizationsCount(params: OrganizationQueryArgs): Promise<number> {
    return this.prisma.organization.count({ where: params.where });
  }

  async createOrg(data: CreateOrganizationInput) {
    return this.prisma.organization.create({
      data,
    });
  }

  // TODO: Consider to remove as this logic is moved to userLoader
  async getOrgUsers(orgId: string) {
    return this.prisma.organization.findUnique({
      relationLoadStrategy: 'join',
      select: {
        userGroupAssignment: {
          where: { deletedAt: null, user: { deletedAt: null } },
          select: { user: true },
        },
      },
      where: {
        id: orgId,
      },
    });
  }
}
