import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommentLikeEntity } from "./CommentLike.entity";
import { CustomerEntity } from "./Customer.entity";
import { CustomerPostEntity } from "./CustomerPost.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import GraphQLJSON from "graphql-type-json";

@ObjectType('PostComment')
@InputType('PostCommentInput')
@Entity('post_comment')
export class PostCommentEntity extends BaseEntity {

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

    @ManyToOne(type => CustomerEntity, { eager: true, cascade: ["insert", "update"] })
    @JoinTable({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    customerId: number;

    @Column({ default: '', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
    @Field(() => String, { defaultValue: '' })
    comment: string;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    views: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    likes: number;

    @Column({ nullable: true, select: false })
    @Field(() => Boolean, { nullable: true })
    isLike: boolean;

    @ManyToOne(type => PostCommentEntity, category => category.children)
    @JoinTable({ name: 'parentId' })
    @Field(() => GraphQLJSON)
    parent: PostCommentEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    parentId: number;

    @OneToMany(type => PostCommentEntity, category => category.parent)
    @Field(() => [PostCommentEntity])
    children: PostCommentEntity[];

    @OneToMany(type => CommentLikeEntity, like => like.comment)
    @Field(() => [CommentLikeEntity])
    commentLikes: CommentLikeEntity[];

    @UpdateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    updated: Date;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

}