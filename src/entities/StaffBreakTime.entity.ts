import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StaffEntity } from "./Staff.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('StaffBreakTime')
@InputType('StaffBreakTimeInput')
@Entity({ name: 'staff_break_time', orderBy: { day: 'ASC' } })
export class StaffBreakTimeEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => Int)
    day: number; //0 for Sunday, 1 for Monday, and so on

    @Column({ default: '8:00' })
    @Field(() => String, { defaultValue: '8:00' })
    fromHour: string;

    @Column({ default: '18:00' })
    @Field(() => String, { defaultValue: '18:00' })
    toHour: string;

    @ManyToOne(type => StaffEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'staffId' })
    @Field(() => StaffEntity)
    staff: StaffEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    staffId: number;
}