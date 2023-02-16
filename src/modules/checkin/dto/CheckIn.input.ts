import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CheckInInputDTO {
  @IsString()
  @Field(() => String)
  phoneNumber: string;

  @IsString()
  @Field(() => String)
  secretKey: string;
}
