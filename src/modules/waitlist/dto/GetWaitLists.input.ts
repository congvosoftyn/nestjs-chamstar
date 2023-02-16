import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetWaitListsInput {
    @Field(()=>String)
    search?: string;
    @Field(()=>String)
    filter?: string;
}