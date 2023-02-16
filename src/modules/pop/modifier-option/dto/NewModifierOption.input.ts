import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class NewModifierOptionInput {
    @Field(()=>Int)
    id?: number;
    @Field()
    name: string;
    @Field(()=>Int)
    price: number;
    @Field(()=>Int,{defaultValue:0})
    orderBy: number = 0;

}