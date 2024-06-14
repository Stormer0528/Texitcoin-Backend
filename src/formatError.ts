import { Prisma } from '@prisma/client';
import { unwrapResolverError } from '@apollo/server/errors';
import type { GraphQLFormattedError } from 'graphql';

export const formatError = (
  formattedError: GraphQLFormattedError,
  error: unknown
): GraphQLFormattedError => {
  const originalError = unwrapResolverError(error);
  if (originalError instanceof Prisma.PrismaClientKnownRequestError) {
    if (originalError.code === 'P2002') {
      const { modelName, target } = originalError.meta;

      if (modelName === 'User' && (target as string[]).includes('email')) {
        return {
          message: 'Email already exists',
          // Important as frontend will use this field to display error stats on form field
          // Original path concept is to show path for graphql query, but we can use it for form field path
          path: ['email'],
        };
      }

      if (modelName === 'Organization') {
        if ((target as string[]).includes('name')) {
          return {
            message: 'Organization name already exists',
            path: ['name'],
          };
        }
        if ((target as string[]).includes('slug')) {
          return {
            message: 'Organization slug already exists',
            path: ['slug'],
          };
        }
      }
    }
  }
  return formattedError;
};
