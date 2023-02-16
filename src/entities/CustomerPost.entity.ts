import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerEntity } from "./Customer.entity";
import { CustomerPostMediaEntity } from "./CustomerPostMedia.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('CustomerPost')
@InputType('CustomerPostInput')
@Entity('customer_post')
export class CustomerPostEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ default: '', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
    @Field({ defaultValue: '' })
    description: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    type: string;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    likes: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    comments: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    views: number;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    isTrending: boolean;

    @Column({ nullable: true, select: false })
    @Field(() => Boolean, { nullable: false })
    isLike: boolean;

    @Column({ nullable: true, select: false })
    @Field(() => Boolean, { nullable: false })
    isFollowing: boolean;

    @UpdateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    updated: Date;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @OneToMany(type => CustomerPostMediaEntity, media => media.post, { eager: true, cascade: ["insert", "update"] })
    @Field(() => [CustomerPostMediaEntity])
    medias: CustomerPostMediaEntity[];

    @ManyToOne(type => CustomerEntity, { eager: true, cascade: ["insert", "update"] })
    @JoinTable({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    customerId: number;

    @OneToMany(type => CustomerEntity, tag => tag.postTag, { eager: true, cascade: ["insert", "update"] })
    @Field(() => [CustomerEntity])
    postCustomerTag: CustomerEntity[];

}