import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class NewModifierInput {
    @Field(()=>Int)
    id?: number;
    @Field(()=>String)
    name: string;
    @Field(()=>Int,{defaultValue: 0})
    orderBy?: number = 0;
    @Field(()=>Boolean)
    selectOneOnly: boolean;
}