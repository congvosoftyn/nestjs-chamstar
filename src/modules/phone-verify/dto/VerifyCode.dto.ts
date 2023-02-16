import { IsString } from "class-validator";

export class VerifyCodeDto {
    @IsString()
    phone: string;

    @IsString()
    code: string;

    @IsString()
    smsMessage: string;
}