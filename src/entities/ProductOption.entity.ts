import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./Product.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('ProductOption')
@InputType('ProductOptionInput')
@Entity({ name: 'product_option', orderBy: { orderBy: 'ASC' } })
export class ProductOptionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    price: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    orderBy: number;

    @ManyToOne(type => ProductEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    @Field(() => ProductEntity)
    product: ProductEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    productId: number;
}
