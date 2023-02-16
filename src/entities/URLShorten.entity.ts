import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, CreateDateColumn } from "typeorm";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('URLShorten')
@InputType('URLShortenInput')
@Entity('url_shorten')
export class URLShortenEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    originalUrl: string;

    @Column()
    @Field(() => String)
    urlCode: string;

    @Column()
    @Field(() => String)
    shortUrl: string;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    createdAt: Date;

    @Column()
    @Field(() => Date)
    updatedAt: Date;
}