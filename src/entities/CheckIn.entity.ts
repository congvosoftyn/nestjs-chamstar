import { Entity, PrimaryGeneratedColumn, BaseEntity, JoinColumn, Column, ManyToOne } from "typeorm";
import { CompanyCustomerEntity } from "./CompanyCustomer.entity";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('CheckIn')
@InputType('CheckInInput')
@Entity('check_in')
export class CheckInEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => Date)
    checkInDate: Date;

    @Column({ nullable: true })
    @Field(() => Date, { nullable: true })
    checkOutDate: Date;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    checkInMessageSent: boolean;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    checkOutMessageSent: boolean;

    @ManyToOne(type => CompanyCustomerEntity, companyCustomer => companyCustomer.checkIn, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyCustomerId' })
    @Field(() => CompanyCustomerEntity)
    companyCustomer: CompanyCustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    companyCustomerId: number;

    @ManyToOne(type => StoreEntity, store => store.checkIn, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    stringId: string;
}
