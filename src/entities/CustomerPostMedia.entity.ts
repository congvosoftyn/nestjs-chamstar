import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerPostEntity } from "./CustomerPost.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('CustomerPostMedia')
@InputType('CustomerPostMediaInput')
@Entity('customer_post_media')
export class CustomerPostMediaEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    url: string;

    @ManyToOne(type => CustomerPostEntity)
    @Field(() => CustomerPostEntity)
    post: CustomerPostEntity;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;
}
