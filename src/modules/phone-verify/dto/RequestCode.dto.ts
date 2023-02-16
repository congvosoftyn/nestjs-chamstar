import { IsPhoneNumber, IsString } from "class-validator";

export class RequestCodeDto {
    @IsString()
    @IsPhoneNumber()
    phone: string;

    @IsString()
    code: string;
}