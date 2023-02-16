import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { CustomerEntity } from "./Customer.entity";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('WaitList')
@InputType('WaitListInput')
@Entity('wait_list')
export class WaitListEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ default: 1 })
    @Field(() => Int, { defaultValue: 1 })
    status: number;

    @Column({ default: 15 })
    @Field(() => Int, { defaultValue: 15 })
    quoted: number;

    @Column({ default: 2 })
    @Field(() => Int, { defaultValue: 2 })
    size: number;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    notes: string;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    messageSent: boolean;

    @Column({ nullable: true })
    @Field(() => Date, { nullable: true })
    messageSentDate: Date;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    phoneCalled: boolean;

    @Column({ nullable: true })
    @Field(() => Date, { nullable: true })
    phoneCalledDate: Date;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    isDone: boolean;

    @Column({ nullable: true })
    @Field(() => Date, { nullable: true })
    doneDate: Date;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    isDeleted: boolean;

    @Column({ nullable: true })
    @Field(() => Date, { nullable: true })
    deletedDate: Date;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @ManyToOne(type => CustomerEntity, Customer => Customer.waitlists, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    customerId: number;

    @ManyToOne(type => StoreEntity, store => store.checkIn, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;
}