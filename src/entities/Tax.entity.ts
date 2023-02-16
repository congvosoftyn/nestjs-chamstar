import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";
import { ProductEntity } from './Product.entity'
import { ObjectType, Field, Int, InputType, Float } from '@nestjs/graphql';

@ObjectType('Tax')
@InputType('TaxInput')
@Entity({ name: 'tax', orderBy: { orderBy: 'ASC' } })
export class TaxEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({ type:"float" , default: 8.25 })
    @Field(() => Float, { defaultValue: 8.25 })
    rate: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    type: number;

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

    @OneToMany(type => ProductEntity, product => product.tax, { cascade: ['insert', 'update'] })
    @Field(() => [ProductEntity])
    products: ProductEntity[];

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    orderBy: number;
}