import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { CompanyEntity } from "./Company.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import GraphQLJSON from "graphql-type-json";

@ObjectType('CompanySetting')
@InputType('CompanySettingInput')
@Entity('company_setting')
export class CompanySettingEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    autoCheckout: boolean;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    checkoutAfter: number;

    @Column({ default: 24 })
    @Field(() => Int, { defaultValue: 24 })
    allowCheckinAfter: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    autoSendRemindMessage: boolean;

    @Column({ default: 7 })
    @Field(() => Int, { defaultValue: 7 })
    sendRemindMessageAfter: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    customRemindMessage: string;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    sendCheckinMessage: boolean;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    autoGeneratedCheckinMessage: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    customCheckinMessage: string;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    sendCheckoutMessage: boolean;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: true })
    askCustomerLeaveGoogleReview: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    googleReviewLink: string;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    askCustomerLeaveYelpReview: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    yelpReviewLink: string;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: true })
    askCustomerLeaveFacebookReview: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    facebookReviewLink: string;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    autoGeneratedCheckoutMessage: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    customCheckoutMessage: string;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    sendClaimedMessage: boolean;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    autoGeneratedClaimedMessage: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    customClaimedMessage: string;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    sendBirthdayMessage: boolean;

    @Column({ default: 'Happy birthday, {{customer}}! We would like you have 10% off on your order. Enjoy your day.' })
    @Field({ defaultValue: 'Happy birthday, {{customer}}! We would like you have 10% off on your order. Enjoy your day.' })
    customBirthdayMessage: string;

    @OneToOne(type => CompanyEntity, company => company.companyCustomer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    @Field(() => GraphQLJSON)
    company: CompanyEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    companyId: number;

    //waitlist settings
    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    showDistanceWaitlistRequest: boolean

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    sendMessageAddingToWaitlist: boolean

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    customMessageForNewWaitlist: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    customMessageForWaitlistReady: string;

}