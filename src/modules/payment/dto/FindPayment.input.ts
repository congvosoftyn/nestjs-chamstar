import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class FindPaymentInput {
    @Field(()=>Int, {defaultValue: 0})
    pageNumber: number = 0;
    @Field(()=>Int, {defaultValue: 10})
    pageSize: number = 10;
}