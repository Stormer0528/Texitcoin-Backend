import { Service } from 'typedi';
import {
  Arg,
  Args,
  Resolver,
  Query,
  Mutation,
  Info,
  Authorized,
  FieldResolver,
  Ctx,
  Root,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { UserRole } from '@/type';
import { Package } from './package.entity';
import { PackageService } from './package.service';
import { CreatePackageInput, PackageQueryArgs, PackageResponse } from './package.type';

@Service()
@Resolver(() => Package)
export class PackageResolver {
  constructor(private readonly service: PackageService) {}

  @Query(() => PackageResponse)
  async packages(
    @Args() query: PackageQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<PackageResponse> {
    const { where, ...rest } = query;
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; packages?: any } = {};

    if ('total' in fields) {
      promises.total = this.service.getPackagesCount(query);
    }

    if ('packages' in fields) {
      promises.packages = this.service.getPackages(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; packages?: Package[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Package)
  async createPackage(@Arg('data') data: CreatePackageInput): Promise<Package> {
    return this.service.createPackage({ ...data });
  }
}
