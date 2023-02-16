import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('OpenHour')
@InputType('OpenHourInput')
@Entity({ name: 'open_hour', orderBy: { day: "ASC" } })
export class OpenHourEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => Int)
    day: number;

    @Column({ default: '09:00' })
    @Field(() => String, { defaultValue: '09:00' })
    fromHour: string;

    @Column({ default: '17:00' })
    @Field(() => String, { defaultValue: '17:00' })
    toHour: string;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    open: boolean;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;
}