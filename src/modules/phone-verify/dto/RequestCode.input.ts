import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class RequestCodeInput {
  @IsString()
  @IsPhoneNumber()
  @Field(() => String)
  phone: string;

  @IsString()
  @Field(() => String)
  code: string;
}
