import { IsString } from "class-validator";

export class CheckInDto {
    @IsString()
    phoneNumber: string;

    @IsString()
    secretKey: string;
}