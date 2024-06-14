import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class BaseEntity {
  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | null;
}
