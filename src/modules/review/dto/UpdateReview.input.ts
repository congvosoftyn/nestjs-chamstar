import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateReviewInput {
    @Field(()=>Int)
    id: number;
    @Field(()=>String)
    name: string;
    @Field(()=>Int)
    rate: number;
    @Field(()=>String)
    comment: string;
}