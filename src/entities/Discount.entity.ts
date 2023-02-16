import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType, Float } from '@nestjs/graphql';

@ObjectType('Discount')
@InputType('DiscountInput')
@Entity('discount')
export class DiscountEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    percentage: boolean;

    @Column({ type: "float", default: 0 })
    @Field(() => Float, { defaultValue: 0 })
    amount: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    orderBy: number;

    @Column({ default: '' })
    @Field(() => String, { defaultValue: '' })
    description: string;
}