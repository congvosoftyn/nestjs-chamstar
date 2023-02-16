import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SaveRoleInput {
    @Field()
    name: string;
}