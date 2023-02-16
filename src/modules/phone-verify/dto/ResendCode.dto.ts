import { IsString } from "class-validator";

export class ResendCodeDto {
    @IsString()
    phone: string;

    @IsString()
    code: string;
}