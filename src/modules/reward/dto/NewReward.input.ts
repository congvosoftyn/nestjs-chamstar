import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class NewRewardInput {
    @Field(()=>String)
    name?: string;
    @Field(()=>Int)
    pointRequired?: number;
}