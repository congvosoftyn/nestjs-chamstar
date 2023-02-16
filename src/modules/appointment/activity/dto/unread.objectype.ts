import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UnreadObjectType {
    @Field(()=>Int)
    count: number;
}