import { ObjectType, Field, ID, Authorized } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

@ObjectType()
export class Address extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  attention: string;

  @Field({ nullable: true })
  department: string;

  @Field({ nullable: true })
  line1: string;

  @Field({ nullable: true })
  line2: string;

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  zip: string;
}
