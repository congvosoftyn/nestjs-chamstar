import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdatePromotionInput {
    @Field()
    name?: string;
    @Field()
    text?: string;
    @Field()
    description?: string;
    @Field()
    groups: string;
    @Field(()=>Date)
    startDate?: Date;
    @Field(()=>Date)
    endDate?: Date;
}