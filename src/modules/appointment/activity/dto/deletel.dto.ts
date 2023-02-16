import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DeleteDto {
    @Field(() => Int)
    affected: number;
}