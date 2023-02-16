import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Employee')
@InputType('EmployeeInput')
@Entity('employee')
export class EmployeeEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({ nullable: false })
    @Field(() => Int, { nullable: false })
    accessCode: number;

    @Column({ nullable: false })
    @Field(() => Int, { nullable: false })
    level: number;  // 1 - Employee , 2 - Manager

    @Column({ nullable: false })
    @Field(() => Int, { nullable: false })
    storeId: number

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean
}