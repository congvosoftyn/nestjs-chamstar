import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class ReOrderProductsInput {
    @Field(()=>Int)
    id?: number;
    
    @Field(()=>String)
    name: string;
    
    @Field(()=>Int)
    cost: number;
    
    @Field(()=>Int)
    price: number;
    
    @Field(()=>Int)
    stocks: number;

    @Field(()=>String)
    description?: string;
    
    @Field(()=>String)
    photo?: string;
    
    @Field(()=>String)
    thumb?: string;
    
    @Field(()=>String)
    color?: string;
    
    @Field(()=>Int)
    orderBy?: number;
    
    @Field(()=>Int,{defaultValue:60})
    serviceDuration: number = 60;
    
    @Field(()=>String)
    SKU?: string;
    
    @Field(()=>Int)
    storeId?: number;
    
    @Field(()=>Int)
    suppilerId?: number;

    @Field(()=>Int)
    categoryId?: number;
}