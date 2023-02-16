import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class QueryGetReportInput {
    @Field(()=>String)
    by: string;
    @Field(()=>Int)
    registerId: number;
    @Field(()=>String)
    start?: string;
    @Field(()=>String)
    end?: string;
}