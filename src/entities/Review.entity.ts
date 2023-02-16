import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, CreateDateColumn, JoinColumn, OneToOne } from "typeorm";
import { CustomerEntity } from "./Customer.entity";
import { StoreEntity } from "./Store.entity";
import { CheckInEntity } from "./CheckIn.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Review')
@InputType('ReviewInput')
@Entity('review')
export class ReviewEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    customerName: string;

    @Column({ default: 5 })
    @Field(() => Int, { defaultValue: 5 })
    rate: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    comments: string;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @OneToOne(type => CheckInEntity)
    @JoinColumn({ name: 'checkInId' })
    @Field(() => CheckInEntity)
    checkIn: CheckInEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    checkInId: number;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;

    @ManyToOne(type => CustomerEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    customerId: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isHappy: boolean;
}