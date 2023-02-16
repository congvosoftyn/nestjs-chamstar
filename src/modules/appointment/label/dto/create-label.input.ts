import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateLabelInput {
  @Field(() => Boolean, { defaultValue: true })
  isEditable: boolean = true;
  @Field(() => String)
  name: string;
  @Field(() => String, { defaultValue: '#EEEEEE' })
  color: string = '#EEEEEE';
  @Field(() => String, { defaultValue: '' })
  description: string = '';
}