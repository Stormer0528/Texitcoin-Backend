import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export abstract class PaginatedResponse {
  @Field(() => Int, { nullable: true })
  total?: number;
}
