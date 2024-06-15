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

import { UserResolver } from './entity/user/user.resolver';
import { SaleResolver } from './entity/sale/sale.resolver';
import { OrganizationResolver } from './entity/organization/organization.resolver';
import { UserGroupResolver } from './entity/userGroup/userGroup.resolver';
import { BigIntScalar } from './graphql/scalar/bigInt';
import { StatisticsResolver } from './entity/statistics/statistics.resolver';
import { UserStatisticsResolver } from './entity/userStatistics/userStatistics.resolver';

// import "./env";

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [
      UserResolver,
      SaleResolver,
      StatisticsResolver,
      OrganizationResolver,
      UserGroupResolver,
      UserStatisticsResolver,
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
    listen: { host: '0.0.0.0.', port: 4000 },
    context,
  });

  console.log(`🚀 Server ready at: ${url}`);
};

app();
