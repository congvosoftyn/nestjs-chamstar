import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class NewProductOptionInput {
    @Field(() => Int)
    id: number;
    @Field(() => String)
    name: string;
    @Field(() => Int)
    price: number;
    @Field(() => Int)
    orderBy: number;
}

@InputType()
export class NewProductInput {
    @Field(() => Int)
    id?: number;

    @Field(() => String)
    name: string;

    @Field(() => Int, { defaultValue: 0 })
    cost: number;

    @Field(() => Int, { defaultValue: 0 })
    price: number;

    @Field(() => Int, { defaultValue: 0 })
    stocks: number;

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    photo?: string;

    @Field(() => String, { nullable: true })
    thumb?: string;

    @Field(() => String, { nullable: true })
    color?: string;

    @Field(() => Int, { defaultValue: 0 })
    orderBy: number;

    @Field(() => Int, { defaultValue: 60 })
    serviceDuration: number = 60;

    @Field(() => String, { nullable: true })
    SKU?: string;

    @Field(() => Int, { nullable: true })
    storeId?: number;

    @Field(() => Int, { nullable: true })
    suppilerId?: number;

    @Field(() => Int, { nullable: true })
    categoryId?: number;

    @Field(() => [NewProductOptionInput], { nullable: true })
    removed_options?: Array<NewProductOptionInput>;
}

