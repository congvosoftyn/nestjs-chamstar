import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "./Customer.entity";
import { PostCommentEntity } from "./PostComment.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('CommentLike')
@InputType('CommentLikeInput')
@Entity('comment_like')
export class CommentLikeEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @ManyToOne(type => PostCommentEntity)
    @JoinTable({ name: 'commentId' })
    @Field(() => PostCommentEntity)
    comment: PostCommentEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    commentId: number;

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