import { ObjectType, Field, Int, InputType } from 'type-graphql';
import { BLOCKSTATETYPE } from './general.type';

@ObjectType()
export class DailyStats {
  @Field()
  field: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class EntityStats {
  @Field()
  total: number;

  @Field(() => [DailyStats])
  dailyData: DailyStats[];

  @Field({ nullable: true })
  meta?: number;
}

@ObjectType()
export class BlockStatsResponse {
  @Field()
  hashRate: number;

  @Field()
  difficulty: number;

  @Field()
  base: string;
}
