import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';
import { User } from '@/entity/user/user.entity';

@ObjectType()
export class UserStatistics extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  blocks: number;

  @Field()
  hashPower: number;

  @Field()
  issuedAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}
