import { Field, InputType, Int } from "@nestjs/graphql";
import { SaleTransactionEntity } from "src/entities/SaleTransaction.entity";

@InputType()
export class SaleTransactionInputDTO {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    reference: string;

    @Field(() => String)
    note: string;

    @Field(() => Int, { nullable: true })
    registerId: number;


    @Field(() => Int, { nullable: true })
    customerId: number;

    @Field(() => Int, { defaultValue: 0 })
    tip: number;

    @Field(() => Int, { nullable: true })
    assignId: number;
}

@InputType()
export class AddPaymentInput {
    @Field(() => Int)
    id: number;

    @Field(() => Int, { defaultValue: 0 })
    amount: number;

    @Field(() => Int, { defaultValue: 0 })
    tip: number;

    @Field(() => Int, { defaultValue: 0 })
    amount_refunded: number;

    @Field({ nullable: true })
    payment_method: string;  // cash, cc, debit, giftcard, other

    @Field({ nullable: true })
    card_brand: string;

    @Field(() => Int, { nullable: true })
    exp_month: number;

    @Field(() => Int, { nullable: true })
    exp_year: number;

    @Field({ nullable: true })
    funding: string; //credit

    @Field({ nullable: true })
    last4: string;

    @Field({ nullable: true })
    network: string;

    @Field({ nullable: true })
    source: string;

    @Field({ nullable: true })
    status: string;

    @Field(() => SaleTransactionInputDTO)
    saleTransaction: SaleTransactionInputDTO;

    @Field(() => Int, { defaultValue: 1 })
    saleTransactionId: number;
}