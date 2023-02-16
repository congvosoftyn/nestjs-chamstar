import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class QueryCommentsInput {
  @Field(() => Int)
  postId: number;
  @Field(() => Int)
  take: number;
  @Field(() => Int)
  skip: number;
}
