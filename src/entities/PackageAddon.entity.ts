import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from "typeorm";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('PackageAddon')
@InputType('PackageAddonInput')
@Entity('package_addon')
export class PackageAddonEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column("decimal", { precision: 11, scale: 2 })
    @Field(() => Int)
    price: number;

    @Column({ default: 500 })
    @Field(() => Int, { defaultValue: 500 })
    messageUsage: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    description: string;

}