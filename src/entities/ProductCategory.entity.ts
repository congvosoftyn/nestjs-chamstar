import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./Product.entity";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { PackageCategoryEntity } from "./package-category.entity";

@ObjectType('ProductCategory')
@InputType('ProductCategoryInput')
@Entity({ name: 'product_category', orderBy: { orderBy: 'ASC' } })
export class ProductCategoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    orderBy: number;

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

    @OneToMany(type => ProductEntity, product => product.category)
    @Field(() => [ProductEntity])
    services: ProductEntity[];

    @OneToMany(() => PackageCategoryEntity, packageCategory => packageCategory.category)
    @Field(() => [PackageCategoryEntity])
    packages: [PackageCategoryEntity];


}
