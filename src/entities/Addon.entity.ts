import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from "typeorm";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@Entity('addon')
@InputType('AddonInput')
@ObjectType('Addon')
export class AddonEntity extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field(() => Int)
    @Column("decimal", { precision: 11, scale: 2 })
    price: number;

    @Field(() => Int, { defaultValue: 500 })
    @Column({ default: 500 })
    messageUsage: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field(() => Boolean, { nullable: true })
    @Column({ default: true })
    isActive: boolean;

    @Field(() => Int, { defaultValue: 0 })
    @Column({ default: 0 })
    orderBy: number;
}