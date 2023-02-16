import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GroupInput {
  @Field()
  name: string;
  @Field()
  icon: string;
}

@InputType()
export class AddCustomerGroupInput {
  @Field(() => Int)
  customerId: number;

  @Field(() => GroupInput)
  group: GroupInput;
}
