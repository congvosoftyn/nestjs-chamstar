import { Matches, MaxLength, MinLength } from "class-validator";

export class CustomerDto {
  @MinLength(10)
  @MaxLength(20)
  @Matches(/\d+/g, { message: 'Phone Number too weak' })
  phoneNumber: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  dob?: number;
  gender?: string;
  avatar?: string;
  website?: string;
  description?: string;
  countryCode?: string;
  isoCode?: string;
}
