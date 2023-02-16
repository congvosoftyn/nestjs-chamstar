import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from "typeorm";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Permission')
@InputType('PermissionInput')
@Entity('permission')
export class PermissionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    title: string;

    @Column({ default: 1 })
    @Field(() => Int, { defaultValue: 1 })
    level: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isSelected: boolean;

    @Column()
    @Field()
    name: string;
}