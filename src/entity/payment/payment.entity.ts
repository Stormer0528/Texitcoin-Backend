import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';
import { Sale } from '../sale/sale.entity';

@ObjectType()
export class Payment extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  status: boolean;

  @Field(() => [Sale], { nullable: 'itemsAndList' })
  sales?: Sale[];
}
