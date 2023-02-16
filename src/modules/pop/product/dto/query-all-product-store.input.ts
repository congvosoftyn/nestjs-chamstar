import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class QueryAllProductStoreInput {
    @Field(() => String, { defaultValue: '', nullable: true })
    search?: string = '';
    @Field(() => Int, { defaultValue: 10, nullable: true })
    take?: number = 10;
    @Field(() => Int, { defaultValue: 0, nullable: true })
    skip?: number = 0;
}
