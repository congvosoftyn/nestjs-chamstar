import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class SendReceiptToCustomerInput{
    @Field()
    reference: string

    @Field()
    methodType: string // email || phone number

    @Field()
    customerInfo: string // email || phone number

    @Field({ nullable: true })
    ticketOrder: string

    @Field({ nullable: true })
    customerName?: string;
}