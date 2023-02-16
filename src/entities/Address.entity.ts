import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinTable } from "typeorm";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { CustomerEntity } from "./Customer.entity";

@ObjectType('Address')
@InputType('AddressInput')
@Entity('address')
export class AddressEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    address?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    address2?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    city?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    state?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    zipcode?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    country: string;

    @ManyToOne(type => CustomerEntity, customer => customer.addresses, { eager: true, nullable: true, cascade: ["insert", "update"] })
    @JoinTable({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    customerId: number;
}