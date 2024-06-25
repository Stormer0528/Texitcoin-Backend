import { InputType, Field } from 'type-graphql';

@InputType()
export class LiveStatsArgs {
  @Field()
  pastDays: number;
}
