import { Service } from 'typedi';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Authorized,
  FieldResolver,
  Root,
  Args,
  Info,
  UseMiddleware,
  Ctx,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

import { type Context } from '@/context';
import { Address } from '@/entity/address/address.entity';
import { AddressService } from '@/entity/address/address.service';
import { User } from '@/entity/user/user.entity';
import { UserGroup } from '@/entity/userGroup/userGroup.entity';
import { UserGroupService } from '@/entity/userGroup/userGroup.service';
import { UserRole } from '@/type';

import { Organization } from './organization.entity';
import { organizationPermission } from './organization.permission';
import { OrganizationService } from './organization.service';
import {
  OrganizationsResponse,
  CreateOrganizationInput,
  OrganizationQueryArgs,
} from './organization.type';

@Service()
@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(
    private readonly service: OrganizationService,
    private readonly userGroupService: UserGroupService,
    private readonly addressService: AddressService
  ) {}

  @Authorized()
  @UseMiddleware(organizationPermission) // Apply the middleware here
  @Query(() => OrganizationsResponse)
  async organizations(
    @Args() query: OrganizationQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<OrganizationsResponse> {
    const fields = graphqlFields(info);

    let promises: { total?: Promise<number>; organizations?: Promise<Organization[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getOrganizationsCount(query);
    }

    if ('organizations' in fields) {
      promises.organizations = this.service.getOrganizations(query);
    }

    const result = await Promise.all(Object.entries(promises));

    let response: { total?: number; organizations?: Organization[] } = {};

    for (let [key, value] of result) {
      response[key] = value;
    }

    return response;
  }

  @Authorized([UserRole.Admin])
  @FieldResolver()
  async userGroups(@Root() org: Organization): Promise<UserGroup[]> {
    return this.userGroupService.getOrgUserGroups(org.id);
  }

  @Authorized([UserRole.Admin])
  @FieldResolver()
  async users(@Root() org: Organization, @Ctx() ctx: Context): Promise<User[]> {
    return ctx.dataLoader.get('userForOrganizationLoader').load(org.id);
  }

  @Authorized()
  @FieldResolver({ nullable: 'itemsAndList' })
  async addresses(@Root() org: Organization, @Ctx() ctx: Context): Promise<Address[]> {
    return ctx.dataLoader
      .get('addressLoader')
      .load({ addressableType: 'Organization', addressableId: org.id });
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => Organization)
  async createOrganization(
    @Arg('data') { addresses, ...data }: CreateOrganizationInput
  ): Promise<Organization> {
    const org = await this.service.createOrg(data);
    let orgAddresses;
    if (addresses) {
      orgAddresses = await this.addressService.createAddress(
        addresses.map((address) => ({
          ...address,
          addressableType: 'Organization',
          addressableId: org.id,
        }))
      );
    }

    return { ...org, addresses: orgAddresses };
  }
}
