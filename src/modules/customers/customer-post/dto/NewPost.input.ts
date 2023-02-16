import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewPostInput {
  @Field()
  description: string;
  @Field(() => [String])
  medias: string[];
  @Field()
  type: string;
}
