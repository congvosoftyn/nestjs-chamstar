import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";
import { UserEntity } from "./User.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Register')
@InputType('RegisterInput')
@Entity('register')
export class RegisterEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    deviceId: string;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    cashTotal: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    cashSubtotal: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    ccTotal: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    ccSubTotal: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    chequeTotal: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    chequeSubtotal: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    cashInHand: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    note: string;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @Column({ nullable: true })
    @Field(() => Date, { nullable: true })
    closeAt: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'closeById' })
    @Field(() => UserEntity)
    closeBy: UserEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    closeById: number;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    @Field(() => UserEntity)
    user: UserEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    userId: number;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;
}