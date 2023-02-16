import { Entity, PrimaryGeneratedColumn, BaseEntity, JoinColumn, Column, ManyToOne } from "typeorm";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Reward')
@InputType('RewardInput')
@Entity('reward')
export class RewardEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @Column({ default: 10 })
    @Field(() => Int, { defaultValue: 10 })
    pointRequired: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;
}
