import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModifierEntity } from "./Modifier.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('ModifierOption')
@InputType('ModifierOptionInput')
@Entity({ name: 'modifier_option', orderBy: { orderBy: 'ASC' } })
export class ModifierOptionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    price: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    orderBy: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;

    @ManyToOne(type => ModifierEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'modifierId' })
    @Field(() => ModifierEntity)
    modifier: ModifierEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    modifierId: number;
}