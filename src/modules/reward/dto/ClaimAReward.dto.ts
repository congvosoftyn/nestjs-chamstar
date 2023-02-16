import { IsNumber } from "class-validator";

export class ClaimARewardDto {
    @IsNumber()
    rewardId: number;

    @IsNumber()
    customerId: number;
}