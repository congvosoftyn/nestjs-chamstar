import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber } from "class-validator";

@InputType()
export class RequestWaitListFromCustomerInput {
    @IsNumber()
    @Field(()=>Int)
    storeId: number;

    @IsNumber()
    @Field(()=>Int)
    tableSize: number;

    @IsNumber()
    @Field(()=>Int)
    distanceToStore: number;
}