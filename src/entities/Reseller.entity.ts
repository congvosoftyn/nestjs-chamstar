import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, OneToMany } from "typeorm";
import { CompanyEntity } from "./Company.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Reseller')
@InputType('ResellerInput')
@Entity('reseller')
export class ResellerEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

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

    @Column({ nullable: true })
    @Field(() => Int, { nullable: true })
    ssn?: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    balance: number;

    @OneToMany(type => CompanyEntity, company => company.reseller)
    @Field(() => [CompanyEntity])
    company: CompanyEntity[];
}