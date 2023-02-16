import { Int,Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateGiftCard {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    code: number;

    @Field(() => Int, { nullable: true })
    pin: number;

    @Field(() => Int, { defaultValue: true })
    balance: number;
   
    @Field(() => Int)
    companyId: number;
}