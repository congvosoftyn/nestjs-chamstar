import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class MessageStatusInput {
    @Field(()=>String)
    MessageSid: string;
    @Field(()=>String)
    MessageStatus: string;
}