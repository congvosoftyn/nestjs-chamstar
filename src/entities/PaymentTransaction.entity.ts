import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SaleTransactionEntity } from "./SaleTransaction.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('PaymentTransaction')
@InputType('PaymentTransactionInput')
@Entity('payment_transaction')
export class PaymentTransactionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    amount: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    tip: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    amount_refunded: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    payment_method: string;  // cash, cc, debit, giftcard, other

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
    @Field({ nullable: true })
    funding: string; //credit

    @Column({ nullable: true })
    @Field({ nullable: true })
    last4: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    network: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    source: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    status: string;

    @ManyToOne(type => SaleTransactionEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'saleTransactionId' })
    @Field(() => SaleTransactionEntity)
    saleTransaction: SaleTransactionEntity;

    @Column({ type: 'int', default: 1 })
    @Field(() => Int, { defaultValue: 1 })
    saleTransactionId: number;
}
