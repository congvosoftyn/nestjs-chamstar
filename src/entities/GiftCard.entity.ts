import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { CompanyEntity } from "./Company.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('GiftCard')
@InputType('GiftCardInput')
@Entity('gift_card')
export class GiftCardEntity extends BaseEntity {

    @PrimaryColumn({ type: 'bigint' })
    @Field(() => Int)
    id: number;

    @Column({ type: 'bigint' })
    @Field(() => Int)
    code: number;

    @Column({ nullable: true })
    @Field(() => Int, { nullable: true })
    pin: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    balance: number;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @ManyToOne(type => CompanyEntity)
    @JoinColumn({ name: 'companyId' })
    @Field(() => CompanyEntity)
    company: CompanyEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    companyId: number;
}