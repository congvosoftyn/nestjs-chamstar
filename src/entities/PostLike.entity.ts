import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "./Customer.entity";
import { CustomerPostEntity } from "./CustomerPost.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('PostLike')
@InputType('PostLikeInput')
@Entity('post_like')
export class PostLikeEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @ManyToOne(type => CustomerPostEntity)
    @JoinTable({ name: 'postId' })
    @Field(() => CustomerPostEntity)
    post: CustomerPostEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    postId: number;

    @ManyToOne(type => CustomerEntity)
    @JoinTable({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    customerId: number;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;
}