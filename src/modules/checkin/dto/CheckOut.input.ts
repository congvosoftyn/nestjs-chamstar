import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CheckOutInput {
  @Field(() => Int)
  customerId: number;
  @Field(() => Int)
  point: number;
}
