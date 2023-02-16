import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StaffEntity } from "./Staff.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('StaffWorkingHour')
@InputType('StaffWorkingHourInput')
@Entity({ name: 'staff_working_hour', orderBy: { day: 'ASC' } })
export class StaffWorkingHourEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => Int)
    day: number; //0 for Sunday, 1 for Monday, and so on

    @Column({ default: '09:00' })
    @Field({ defaultValue: '09:00' })
    fromHour: string;

    @Column({ default: '17:00' })
    @Field({ defaultValue: '17:00' })
    toHour: string;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    open: boolean; // Dayoff will be set false

    @ManyToOne(type => StaffEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'staffId' })
    @Field(() => StaffEntity)
    staff: StaffEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    staffId: number;
}