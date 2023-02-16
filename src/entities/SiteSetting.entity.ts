import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('SiteSetting')
@InputType('SiteSettingInput')
@Entity('site_setting')
export class SiteSettingEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    key: string;

    @Column()
    @Field()
    value: string;

}