import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PackageEntity } from "./Package.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('SiteModule')
@InputType('SiteModuleInput')
@Entity('site_module')
export class SiteModuleEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    description: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    color: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    route: string;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @ManyToMany(type => PackageEntity, p => p.siteModules)
    @Field(() => [PackageEntity])
    packages: PackageEntity[];

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    icon: string;
}