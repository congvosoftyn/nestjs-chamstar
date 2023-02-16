import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CompanyEntity } from "./Company.entity";
import { CustomerEntity } from "./Customer.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('MessageSent')
@InputType('MessageSentInput')
@Entity('message_sent')
export class MessageSentEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => Date)
    created: Date;

    @Column()
    @Field(() => String)
    messageId: string;

    @Column()
    @Field(() => String)
    fromNumber: string;

    @Column()
    @Field(() => String)
    toNumber: string;

    @Column()
    @Field(() => String)
    messageBody: string;

    @Column({ default: '0', nullable: true })
    @Field(() => String, { defaultValue: '0', nullable: true })
    price: string;

    @Column({ default: 'USD', nullable: true })
    @Field(() => String, { defaultValue: 'USD', nullable: true })
    priceUnit: string;

    @Column()
    @Field(() => String)
    status: string;

    @ManyToOne(type => CustomerEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column()
    @Field(() => Int)
    customerId: number;

    @ManyToOne(type => CompanyEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    @Field(() => CompanyEntity)
    company: CompanyEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    companyId: number;
}