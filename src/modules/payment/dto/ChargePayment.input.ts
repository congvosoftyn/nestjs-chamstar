import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ChargePaymentInput {
  @Field(() => Int)
  amount: number;
  @Field(() => String)
  token: string;
  @Field(() => String)
  card: string;
  @Field(() => Int)
  billId: number;
}
