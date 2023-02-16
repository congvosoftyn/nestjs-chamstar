import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateAssignInput {
  @Field()
  name: string;
  @Field(() => Int, { defaultValue: 0 })
  orderBy?: number = 0;
  @Field(() => Int)
  x?: number;
  @Field(() => Int)
  y?: number;
  @Field(() => Int)
  height?: number;
  @Field(() => Int)
  width?: number;
}
