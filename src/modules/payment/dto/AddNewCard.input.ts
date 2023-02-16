import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddNewCardInput {
  @Field()
  token: string;
  @Field()
  autoPay?: string;
}
