import { Field, InputType, Int, ObjectType, Float } from "@nestjs/graphql";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentInfoEntity } from "./AppointmentInfo.entity";
import { ProductEntity } from "./Product.entity";
import { ProductCategoryEntity } from "./ProductCategory.entity";

@ObjectType('PackageCategory')
@InputType('PackageCategoryInput')
@Entity({ name: "package_category" })
export class PackageCategoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @ManyToMany(() => ProductEntity, product => product.packageCategory)
    @Field(() => [ProductEntity] || null, { nullable: true })
    @JoinTable()
    services: [ProductEntity]

    @ManyToOne(() => ProductCategoryEntity)
    @Field(() => ProductCategoryEntity)
    @JoinColumn({ name: 'categoryId' })
    category: ProductCategoryEntity;

    @Column({ type: "int" })
    @Field(() => Int)
    categoryId: number;

    @Column({ type: "float" })
    @Field(() => Float)
    price: number;

    @Column({ default: true, type: "boolean" })
    @Field({ defaultValue: true })
    deleted: boolean;

    @Field(() => AppointmentInfoEntity)
    @OneToMany(() => AppointmentInfoEntity, info => info.packages)
    bookingInfo: AppointmentInfoEntity;
}
