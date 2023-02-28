import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToMany, OneToOne, ManyToOne, JoinColumn, JoinTable, Index, CreateDateColumn } from "typeorm";
import { CheckInEntity } from "./CheckIn.entity";
import { StoreSettingEntity } from "./StoreSetting.entity";
import { PictureEntity } from "./Picture.entity";
import { OpenHourEntity } from "./OpenHour.entity";
import { TagEntity } from "./Tag.entity";
import { StaffEntity } from "./Staff.entity";
import { AppointmentSettingEntity } from "./AppointmentSetting.entity";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { UserEntity } from "./User.entity";
import { CustomerEntity } from "./Customer.entity";

@ObjectType('Store')
@InputType('StoreInput')
@Entity('store')
export class StoreEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    bookingPage: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    categories: string;

    @Column({ default: 1 })
    @Field(() => Int, { defaultValue: 1 })
    priceRange: number;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    email: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    address?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    address2?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    city?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    state?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    zipcode?: string;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    icon: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    image: string;

    @ManyToOne(type => UserEntity, user => user.stores, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    @Field(() => UserEntity)
    user: UserEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    userId: number;

    @OneToMany(type => CheckInEntity, checkin => checkin.store)
    @Field(() => [CheckInEntity])
    checkIn: CheckInEntity[];

    @OneToOne(type => StoreSettingEntity, setting => setting.store,{ cascade: ["update", "insert", "remove"] })
    @Field(() => StoreSettingEntity)
    storeSetting: StoreSettingEntity;

    @OneToOne(type => AppointmentSettingEntity, appointmentSetting => appointmentSetting.store, { cascade: ["update", "insert", "remove"] })
    @Field(() => AppointmentSettingEntity)
    appointmentSetting: AppointmentSettingEntity;

    @ManyToMany(type => PictureEntity, { cascade: ["update", "insert", "remove"] })
    @JoinTable()
    @Field(() => [PictureEntity])
    pictures: PictureEntity[];

    @OneToMany(type => OpenHourEntity, openHour => openHour.store, { cascade: ["update", "insert", "remove"] })
    @Field(() => [OpenHourEntity])
    openHours: OpenHourEntity[];

    @ManyToMany(type => TagEntity)
    @JoinTable()
    @Field(() => [TagEntity])
    tags: TagEntity[];

    @Index({ where: "subDomain IS NOT NULL" })
    @Column({ nullable: true })
    @Field(() => String)
    subDomain: string;

    @OneToMany(type => StaffEntity, staff => staff.store,)
    @JoinTable()
    @Field(() => [StaffEntity])
    staffs: StaffEntity[];

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    website: string;

    @Column("simple-array", { default: "" })
    @Field(() => [String], { defaultValue: [] })
    pushTokens: string[];

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    imported: boolean;

    @Column("simple-array", { default: "" })
    @Field(() => [String], { defaultValue: [] })
    types: string[];

    @Column({ default: 'America/Chicago' })
    @Field(() => String, { defaultValue: 'America/Chicago' })
    timezone: string;

    @Column({ default: 15 })
    @Field(() => Int, { defaultValue: 15 })
    bookingSlotSize: number;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    notes: string;

    @Column({ nullable: true })
    @Field(() => Int, { nullable: true })
    cancelTime: number;

    @Column({ default: 'USD' })
    @Field(() => String, { defaultValue: 'USD' })
    currency: string;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    default: boolean;

    @OneToMany(type => CustomerEntity, customer => customer.store)
    @Field(() => [CustomerEntity])
    customers: CustomerEntity[];

    fullAddress() {
        return `${this.address} ${this.city}, ${this.state} ${this.zipcode}`
    }
}