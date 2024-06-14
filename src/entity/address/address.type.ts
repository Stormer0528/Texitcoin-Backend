import { InputType, Field } from 'type-graphql';

export interface AddressPolymorphic {
  addressableType: 'Organization' | 'Invoice';
  addressableId: string;
}

// Create User Input and Response
@InputType()
export class CreateAddressInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  attention: string;

  @Field({ nullable: true })
  department: string;

  @Field()
  line1: string;

  @Field({ nullable: true })
  line2: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zip: string;

  @Field()
  addressableType: string;

  @Field()
  addressableId: string;
}
