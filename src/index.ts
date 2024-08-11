import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLScalarType } from 'graphql';
import { DateTimeResolver } from 'graphql-scalars';
import * as tq from 'type-graphql';
import { Container } from 'typedi';

import { authChecker } from './authChecker';
import { Context, context } from './context';
import { formatError } from './formatError';

import { MemberResolver } from './entity/member/member.resolver';
import { SaleResolver } from './entity/sale/sale.resolver';
import { BigIntScalar } from './graphql/scalar/bigInt';
import { StatisticsResolver } from './entity/statistics/statistics.resolver';
import { MemberStatisticsResolver } from './entity/memberStatistics/memberStatistics.resolver';
import { BlockResolver } from './entity/block/block.resolver';
import { GeneralResolver } from './entity/general/general.resolver';
import { PackageResolver } from './entity/package/package.resolver';
import { PayoutResolver } from './entity/payout/payout.resolver';
import { StatisticsSaleResolver } from './entity/statisticsSale/statisticsSale.resolver';
import { AdminResolver } from './entity/admin/admin.resolver';

// import "./env";

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [
      AdminResolver,
      MemberResolver,
      SaleResolver,
      StatisticsResolver,
      StatisticsSaleResolver,
      MemberStatisticsResolver,
      BlockResolver,
      GeneralResolver,
      PackageResolver,
      PayoutResolver,
    ],
    authChecker,
    scalarsMap: [
      { type: GraphQLScalarType, scalar: DateTimeResolver },
      { type: BigInt, scalar: BigIntScalar },
    ],
    validate: { forbidUnknownValues: false },
    // Registry 3rd party IOC container
    container: Container,
  });

  const server = new ApolloServer<Context>({
    schema,
    formatError,
  });

  const { url } = await startStandaloneServer<Context>(server, {
    listen: { host: '0.0.0.0', port: 4000 },
    context,
  });

  console.log(`🚀 Server ready at: ${url}`);
};

app();
