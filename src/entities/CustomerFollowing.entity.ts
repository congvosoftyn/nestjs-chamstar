import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerEntity } from "./Customer.entity";
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Entity('customer_following')
@ObjectType('CustomerFollowing')
export class CustomerFollowingEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @UpdateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    updated: Date;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @ManyToOne(type => CustomerEntity, { eager: true, cascade: ["insert", "update"] })
    @JoinTable({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    customerId: number;

    @ManyToOne(type => CustomerEntity)
    @JoinTable({ name: 'followingId' })
    @Field(() => CustomerEntity)
    following: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    followingId: number;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    shield: boolean;

    @Column({ default: '' })
    @Field(() => String, { defaultValue: '' })
    remark: string;

}