import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateSettingInput{
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    storeId: number;

    //checkout
    @Field(() => Boolean, { defaultValue: true })
    checkOutQuickAmountsEnable: boolean;

    @Field(() => Boolean, { defaultValue: true })
    offlineMode: boolean;

    @Field(() => Boolean, { defaultValue: true })
    orderTicketsAuto: boolean;

    @Field(() => String, { defaultValue: '1000' })
    ticketStartingPoint: string;
    // giftcard

    @Field(() => [Int], { defaultValue: "10,15,20,25,50" })
    giftCardQuickAmounts: number[]

    @Field(() => Boolean, { defaultValue: true })
    allowCustomAmountsGiftCard: boolean;

    @Field(() => Boolean, { defaultValue: true })
    allowEGiftCard: boolean;

    // tipping
    @Field(() => [Int], { defaultValue: "15,18,20" })
    tipping: number[];

    @Field(() => Boolean, { defaultValue: true })
    collectSignatures: boolean;

    @Field(() => Boolean, { defaultValue: false })
    collectSignaturesOver25: boolean;

    @Field(() => Boolean, { defaultValue: true })
    signOnDevice: boolean;  //if false sign on receipt

    @Field(() => Boolean, { defaultValue: false })
    skipReceiptScreen: boolean;

    @Field(() => Boolean, { defaultValue: true })
    collectTips: boolean;

    @Field(() => Boolean, { defaultValue: false })
    smartTipAmount: boolean; // if not set percentage amounts

    @Field(() => Boolean, { defaultValue: true })
    calculateTipAfterTaxes: boolean;

    @Field(() => Boolean, { defaultValue: true })
    allowCustomAmounts: boolean;

    @Field(() => Boolean, { defaultValue: true })
    separateTippingScreen: boolean;
}