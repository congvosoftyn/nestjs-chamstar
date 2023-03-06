import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { BillingEntity } from "./Billing.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Payment')
@InputType('PaymentInput')
@Entity('payment')
export class PaymentEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    stripeId: string;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    amount: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    amount_refunded: number;

    @Column()
    @Field()
    payment_method: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    card_brand: string;

    @Column({ nullable: true })
    @Field(() => Int, { nullable: true })
    exp_month: number;

    @Column({ nullable: true })
    @Field(() => Int, { nullable: true })
    exp_year: number;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    funding: string; //credit

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    last4: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    network: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    source: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    status: string;

    @ManyToOne(type => BillingEntity, bill => bill.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'billingId' })
    @Field(() => BillingEntity)
    billing: BillingEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    billingId: number;
}