import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "./Customer.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('PrivateChat')
@InputType('PrivateChatInput')
@Entity('private_chat')
export class PrivateChatEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @ManyToOne(type => CustomerEntity)
    @JoinTable({ name: 'fromCustomerId' })
    @Field(() => CustomerEntity)
    fromCustomer: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    fromCustomerId: number;

    @ManyToOne(type => CustomerEntity)
    @JoinTable({ name: 'toCustomerId' })
    @Field(() => CustomerEntity)
    toCustomer: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    toCustomerId: number;

    @Column({ type: 'text', default: '' })
    @Field(() => String)
    message: string;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @Column("simple-array", { default: "" })
    @Field(() => [String], { defaultValue: "" })
    attachments: string[];
}
