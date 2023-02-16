import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class FollowerListInput {
    @Field(()=>Int)
    customerId: number;
    @Field(()=>Int)
    take: number;
    @Field(()=>Int)
    skip: number;
}