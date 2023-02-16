import { IsNumber, IsString } from "class-validator";

export class UpgradeSubscriptionDto {
    @IsString()
    subscription: string;

    @IsNumber()
    selectedPackage: number;
}