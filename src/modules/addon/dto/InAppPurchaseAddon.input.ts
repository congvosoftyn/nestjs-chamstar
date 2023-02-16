import { Field, InputType, Int } from "@nestjs/graphql";
import { AddAddonToBillInput } from "./AddAddonToBill.input";

@InputType()
export class IapInput {
    @Field(() => String)
    receipt: string;

    @Field(() => Int)
    price: number;
}

@InputType()
export class InAppPurchaseAddonInput {
    @Field(() => AddAddonToBillInput)
    addon: AddAddonToBillInput;

    @Field(() => IapInput)
    iap: IapInput;
}

