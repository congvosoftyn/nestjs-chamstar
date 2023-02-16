import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class VerifyCodeInput {
  @IsString()
  @Field()
  phone: string;

  @IsString()
  @Field()
  code: string;

  @IsString()
  @Field()
  smsMessage: string;
}
