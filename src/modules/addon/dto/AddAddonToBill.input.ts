import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";

@InputType()
export class AddAddonToBillInput {
    @IsString()
    @Field(() => String)
    name: string;

    @IsNumber()
    @Field(() => Int)
    price: number;

    @IsNumber()
    @Field(() => Int)
    messageUsage: number;

    @IsString()
    @Field(() => String)
    description: string;
}