import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class NewDiscountInput {
    @Field(()=>Int)
    id?: number;
    @Field(()=>String)
    name: string;
    @Field(()=>Boolean,{defaultValue: true})
    percentage: boolean = true;
    @Field(()=>Int,{defaultValue: 0})
    amount: number = 0
    @Field(()=>Int,{defaultValue: 0})
    orderBy: number = 0;
}