import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class NewTaxInput {
    @Field(()=>String)
    name: string;
    @Field(()=>Int)
    rate: number;
    @Field(()=>Int,{defaultValue: 0})
    type?: number = 0;
    @Field(()=>Int,{defaultValue: 0})
    orderBy?: number = 0;

}