import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ResendCodeInput {
  @Field(() => String)
  @IsString()
  phone: string;

  @IsString()
  @Field(() => String)
  code: string;
}
