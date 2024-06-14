// src/scalars/BigIntScalar.ts
import { GraphQLScalarType, Kind, ASTNode } from 'graphql';

export const BigIntScalar = new GraphQLScalarType({
  name: 'BigInt',
  description: 'BigInt custom scalar type',
  serialize(value: unknown): string {
    // Convert outgoing BigInt to string for JSON
    return (value as bigint).toString();
  },
  parseValue(value: unknown): bigint {
    // Convert incoming integer to BigInt
    return BigInt(value as string);
  },
  parseLiteral(ast: ASTNode): bigint | null {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to BigInt and integer literal
      return BigInt(ast.value);
    }
    return null;
  },
});
