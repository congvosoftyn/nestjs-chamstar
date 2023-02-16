import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { SiteModuleEntity } from "./SiteModule.entity";
import { SubscriptionEntity } from "./Subscription.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Package')
@InputType('PackageInput')
@Entity('package')
export class PackageEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column("decimal", { precision: 11, scale: 2 })
    @Field(() => Int)
    price: number;

    @Column({ default: 500 })
    @Field(() => Int, { defaultValue: 500 })
    messageUsage: number;

    @Column({ default: 30 })
    @Field(() => Int, { defaultValue: 30 })
    billingCycle: number; //Days

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isAutoRenew: boolean;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    isUpgradable: boolean;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    isAutoUpgrade: boolean;

    @Column({ default: 1 })
    @Field(() => Int, { defaultValue: 1 })
    autoUpgradeAfter: number;  // Billing cirlce

    // @Column({default: false})
    // loyaltyIncluded: boolean;

    // @Column({default: false})
    // posIncluded:boolean;

    // @Column({default: false})
    // bookingIncluded:boolean;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    autoUpgradePackageId: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    isDefault: boolean;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    isHidden: boolean;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    orderBy: number;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    description: string;

    @OneToMany(type => SubscriptionEntity, subs => subs.package)
    @Field(() => [SubscriptionEntity])
    subscription: SubscriptionEntity[];

    @ManyToMany(type => SiteModuleEntity, m => m.packages)
    @JoinTable()
    @Field(() => [SiteModuleEntity])
    siteModules: SiteModuleEntity[];

}