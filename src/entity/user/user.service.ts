import { Service, Inject } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateUserInput, UpdateUserInput, UserQueryArgs } from './user.type';

@Service()
export class UserService {
  constructor(
    @Inject(() => PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async getUsers(params: UserQueryArgs) {
    return this.prisma.user.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getUsersCount(params: UserQueryArgs): Promise<number> {
    return this.prisma.user.count({ where: params.where });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: CreateUserInput & { password: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser({ id, ...data }: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePassword({ id, password }: { id: string; password: string }) {
    return this.prisma.user.update({
      where: { id },
      data: { password },
    });
  }
}
