import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Tag')
@InputType('TagInput')
@Entity('tag')
export class TagEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;


}