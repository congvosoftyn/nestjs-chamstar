import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import GraphQLJSON from "graphql-type-json";

@ObjectType('PosSetting')
@InputType('PosSettingInput')
@Entity('pos_setting')
export class PosSettingEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @OneToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => GraphQLJSON)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;

    //checkout
    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    checkOutQuickAmountsEnable: boolean;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    offlineMode: boolean;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    orderTicketsAuto: boolean;

    @Column({ default: '1000' })
    @Field(() => String, { defaultValue: '1000' })
    ticketStartingPoint: string;
    // giftcard

    @Column("simple-array", { default: "10,15,20,25,50" })
    @Field(() => [Int], { defaultValue: [10, 15, 20, 25, 50] })
    giftCardQuickAmounts: number[]

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    allowCustomAmountsGiftCard: boolean;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    allowEGiftCard: boolean;

    // tipping
    @Column("simple-array", { default: "15,18,20" })
    @Field(() => [Int], { defaultValue: [15, 18, 20] })
    tipping: number[];

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    collectSignatures: boolean;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    collectSignaturesOver25: boolean;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    signOnDevice: boolean;  //if false sign on receipt

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    skipReceiptScreen: boolean;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    collectTips: boolean;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    smartTipAmount: boolean; // if not set percentage amounts

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    calculateTipAfterTaxes: boolean;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    allowCustomAmounts: boolean;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    separateTippingScreen: boolean;

}