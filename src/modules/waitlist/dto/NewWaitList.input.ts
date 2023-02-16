import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class NewWaitListInput {
    @Field(() => Int)
    status?: number;

    @Field(() => Int)
    quoted?: number;

    @Field(() => Int)
    size?: number;

    @Field(() => String)
    notes: string;

    @Field(() => Date)
    messageSentDate: Date;

    @Field(() => Date)
    phoneCalledDate: Date;

    @Field(() => Date)
    doneDate: Date;

    @Field(() => Date)
    deletedDate: Date;
}