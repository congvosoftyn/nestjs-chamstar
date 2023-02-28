import { Field, InputType, Int, ObjectType, Float } from "@nestjs/graphql";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentInfoEntity } from "./AppointmentInfo.entity";
import { ProductEntity } from "./Product.entity";
import { CategoryEntity } from "./Category.entity";

@ObjectType('PackageCategory')
@InputType('PackageCategoryInput')
@Entity({ name: "package_category" })
export class PackageEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @ManyToMany(() => ProductEntity, product => product.packageCategory)
    @Field(() => [ProductEntity] || null, {nullable: true})
    @JoinTable()
    services: [ProductEntity]

    @ManyToOne(() => CategoryEntity)
    @Field(() => CategoryEntity)
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;

    @Column({ type: "int" })
    @Field(() => Int)
    categoryId: number;

    @Column()
    @Field(() => Float)
    price: number;

    @Column({ default: true, type: "boolean" })
    @Field({ defaultValue: true })
    deleted: boolean;

    @Field(() => AppointmentInfoEntity)
    @OneToMany(() => AppointmentInfoEntity, info => info.packages)
    bookingInfo: AppointmentInfoEntity;
}
