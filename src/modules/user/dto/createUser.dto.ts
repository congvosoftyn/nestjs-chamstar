import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class CreateStoreDto {
  name: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  zipcode: string = '';
  categories: string = '';
  phoneNumber: string = '';
}

export class CreateUserDto extends PartialType(CreateAccountDto) {
  store: CreateStoreDto;
  deviceToken?: string;
}
