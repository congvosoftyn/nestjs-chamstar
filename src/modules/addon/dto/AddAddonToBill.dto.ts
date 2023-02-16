import { IsNumber, IsOptional, IsString } from "class-validator";

export class AddAddonToBillDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    messageUsage: number = 500;

    @IsString()
    @IsOptional()
    description?: string;
}