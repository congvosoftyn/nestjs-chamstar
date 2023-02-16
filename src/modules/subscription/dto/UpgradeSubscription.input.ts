import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";

@InputType()
export class UpgradeSubscriptionInput {
    @IsString()
    @Field(() => String)
    subscription: string;

    @IsNumber()
    @Field(() => Int)
    selectedPackage: number;
}