import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber } from "class-validator";

@InputType()
export class ClaimARewardInput {
    @Field(()=>Int)
    @IsNumber()
    rewardId: number;

    @Field(()=>Int)
    @IsNumber()
    customerId: number;
}