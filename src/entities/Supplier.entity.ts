import { BaseEntity, Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AddressEntity } from "./Address.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType("Suplier")
@InputType('SuplierInput')
@Entity('supplier')
export class SupplierEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    phone: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    email: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    note: string;

    @ManyToOne(type => AddressEntity, { eager: true })
    @JoinTable()
    @Field(() => AddressEntity)
    address: AddressEntity;
}