import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewEmployeeInput {
  @Field(() => Int)
  id?: number;
  @Field(() => String)
  name: string;
  @Field(() => String)
  accessCode: string;
  @Field(() => String)
  level: string;
}
