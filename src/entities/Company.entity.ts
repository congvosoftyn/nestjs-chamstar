import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, OneToOne, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { UserEntity } from "./User.entity";
import { CompanyCustomerEntity } from "./CompanyCustomer.entity";
import { CompanySettingEntity } from "./CompanySetting.entity";
import { StoreEntity } from "./Store.entity";
import { ResellerEntity } from "./Reseller.entity";
import { SubscriptionEntity } from "./Subscription.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Company')
@InputType('CompanyInput')
@Entity('company')
export class CompanyEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    categories: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    address2?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    state?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    zipcode?: string;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    balance: number;

    @OneToMany(type => UserEntity, user => user.company)
    @Field(() => [UserEntity])
    user: UserEntity[];

    @OneToMany(type => CompanyCustomerEntity, companyCustomer => companyCustomer.company)
    @Field(() => [CompanyCustomerEntity])
    companyCustomer: CompanyCustomerEntity[];

    @OneToOne(type => CompanySettingEntity, setting => setting.company)
    @Field(() => CompanySettingEntity)
    companySetting: CompanySettingEntity;

    @OneToMany(type => StoreEntity, store => store.company)
    @Field(() => [StoreEntity])
    store: StoreEntity[];

    @OneToMany(type => SubscriptionEntity, subs => subs.company)
    @Field(() => [SubscriptionEntity])
    subscription: SubscriptionEntity[];

    @Column({ nullable: true }) //TODO add select to false to use only internal
    @Field({ nullable: true })
    stripeCustomerId: string;

    @ManyToOne(type => ResellerEntity, reseller => reseller.company, { nullable: true })
    @JoinColumn({ name: 'resellerId' })
    @Field(() => ResellerEntity)
    reseller: ResellerEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    resellerId: number;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;
}
