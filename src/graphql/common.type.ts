import { Field, ID, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class ManySuccessResponse {
  @Field()
  count: number;
}

@InputType()
export class IDInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class IDsInput {
  @Field(() => [ID])
  ids: string[];
}

export enum SuccessResult {
  success = 'success',
  failed = 'failed',
}

@ObjectType()
export class SuccessResponse {
  @Field()
  result: SuccessResult;

  @Field({ nullable: true })
  message?: string;
}
