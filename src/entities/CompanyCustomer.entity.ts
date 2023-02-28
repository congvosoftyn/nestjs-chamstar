import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, JoinColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { CompanyEntity } from "./Company.entity";
import { CustomerEntity } from "./Customer.entity";
import { CheckInEntity } from "./CheckIn.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('CompanyCustomer')
@InputType('CompanyCustomerInput')
@Entity('company_customer')
export class CompanyCustomerEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    totalPoint: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    nickname: string;

    @Column({ nullable: true })
    @Field(() => Date, { nullable: true })
    lastCheckIn: Date;

    @Column({ nullable: true, type: 'text' })
    @Field({ nullable: true })
    note: string;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    remindSent: boolean;

    @ManyToOne(type => CompanyEntity, company => company.companyCustomer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    @Field(() => CompanyEntity)
    company: CompanyEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    companyId: number;

    @ManyToOne(type => CustomerEntity, customer => customer.companyCustomer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    customerId: number;

    @OneToMany(type => CheckInEntity, checkin => checkin.companyCustomer)
    @Field(() => [CheckInEntity])
    checkIn: CheckInEntity[];

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    balance: number

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    giftCardBalance: number

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;
}