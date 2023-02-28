import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, Unique, CreateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from "typeorm";
import { IsEmail } from "class-validator";
import { AddressEntity } from "./Address.entity";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import GraphQLJSON from "graphql-type-json";
import { BillingEntity } from "./Billing.entity";

@ObjectType('Customer')
@InputType('CustomerInput')
@Entity('customer')
@Unique(["phoneNumber", "countryCode"])
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  phoneNumber: string;

  @Column({ default: '+1' })
  @Field({ defaultValue: '+1' })
  countryCode: string;

  @Column({ default: 'us' })
  @Field({ defaultValue: 'us' })
  isoCode: string;

  @Column({ nullable: true })
  @IsEmail()
  @Field({ nullable: true })
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dob: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  gender: string; //male or female

  @Column({ nullable: true, type: 'text' })
  @Field({ nullable: true })
  avatar: string;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  verified: boolean

  @ManyToOne(type => StoreEntity, store => store.customers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  @Field(() => StoreEntity)
  store: StoreEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  storeId: number;

  @CreateDateColumn({ precision: null, type: "timestamp" })
  @Field(() => Date)
  created: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  fcmToken: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  website: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @OneToMany(() => AddressEntity, address => address.customer, { cascade: ["insert", "update"] })
  @Field(() => [AddressEntity])
  addresses: AddressEntity[];

  @ManyToMany(type => StoreEntity)
  @JoinTable()
  @Field(() => [StoreEntity])
  favorStores: StoreEntity[];

  @ManyToOne(type => BillingEntity)
  @Field(() => GraphQLJSON)
  billing: BillingEntity;

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  getPhoneNumber() {
    return this.countryCode + this.phoneNumber;
  }
}