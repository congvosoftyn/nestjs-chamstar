import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewCategoryInput {
  @Field()
  name: string;
  @Field(() => Int, { defaultValue: 0 })
  orderBy: number = 0;
}
