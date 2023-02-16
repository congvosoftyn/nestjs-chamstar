import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StaffEntity } from "./Staff.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('StaffTimeOff')
@InputType('StaffTimeOffInput')
@Entity({ name: 'staff_time_off', orderBy: { startDate: 'ASC' } })
export class StaffTimeOffEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    allDay: boolean;

    @ManyToOne(type => StaffEntity, { onDelete: 'CASCADE', onUpdate: "CASCADE" })
    @JoinColumn({ name: 'staffId' })
    @Field(() => StaffEntity)
    staff: StaffEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    staffId: number;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    note: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    repeat: string; // Daily, Weekly, Monthly

    @Column({ default: 1 })
    @Field(() => Int, { defaultValue: 1 })
    repeatEvery: number; // 1 day, 2 week, or 6 month

    @Column("simple-array", { default: "" }) // apply for repeating weekly only
    @Field(() => [Int], { defaultValue: [] })
    repeatOn: number[]; // 0: Sunday, 1: Monday, and so on 

    @Column({ precision: null, nullable: true, type: "timestamp" })
    @Field(() => Date, { nullable: true })
    startDate: Date; //repeat start date

    @Column({ precision: null, nullable: true, type: "timestamp" })
    @Field(() => Date, { nullable: true })
    endDate: Date; //repeat end date

    @Column({ default: 30 })
    @Field(() => Int, { defaultValue: 30 })
    duration: number;
}