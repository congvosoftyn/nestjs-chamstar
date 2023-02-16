import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class FindSubscriptionInput {
    @Field(() => Int)
    pageNumber: number;
    @Field(() => Int)
    pageSize: number;
}