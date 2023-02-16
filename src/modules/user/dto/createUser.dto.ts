import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class CreateStoreDto {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsString()
  city: string;
  @IsString()
  state: string;
  @IsString()
  zipcode: string;
  @IsString()
  categories: string;
  @IsString()
  phoneNumber: string;
}

export class CreateUserDto extends PartialType(CreateAccountDto) {
  store: CreateStoreDto;
  deviceToken?: string;
}
