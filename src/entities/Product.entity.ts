import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { ModifierEntity } from './Modifier.entity';
import { ProductCategoryEntity } from './ProductCategory.entity';
import { ProductOptionEntity } from './ProductOption.entity';
import { StaffEntity } from './Staff.entity';
import { StoreEntity } from './Store.entity';
import { SupplierEntity } from './Supplier.entity';
import { TaxEntity } from './Tax.entity';
import { ObjectType, Field, Int, InputType, Float } from '@nestjs/graphql';
import { PackageCategoryEntity } from './package-category.entity';
import { AppointmentInfoEntity } from './AppointmentInfo.entity';
import { BillingDetailEntity } from './BillingDetailt.entity';

@ObjectType('Product')
@InputType('ProductInput')
@Entity({ name: 'product', orderBy: { orderBy: 'ASC' } })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column('decimal', {
    transformer: {
      to(value) {
        return parseFloat(value)
      },
      from(value) {
        return parseFloat(value)
      }
    }, precision: 11, scale: 2, default: 0
  })
  @Field(() => Float, { defaultValue: 0 })
  cost: number;

  @Column('decimal', {
    transformer: {
      to(value) {
        // return value;
        return parseFloat(value)
      },
      from(value) {
        return parseFloat(value)
      }
    }, precision: 11, scale: 2, default: 0
  })
  @Field(() => Int, { defaultValue: 0 })
  price: number;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  stocks: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  photo: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  thumb: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  color: string;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  orderBy: number;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  isPrivate: boolean;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  isService: boolean;

  @Column({ default: 60 })
  @Field(() => Int, { defaultValue: 60 })
  serviceDuration: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  SKU: string;

  @ManyToOne((type) => StoreEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  @Field(() => StoreEntity)
  store: StoreEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  storeId: number;

  // @ManyToOne((type) => SupplierEntity, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'suppilerId' })
  // @Field(() => SupplierEntity)
  // supplier: SupplierEntity;

  // @Column({ type: 'int', nullable: true })
  // @Field(() => Int, { nullable: true })
  // suppilerId: number;

  @ManyToOne((type) => TaxEntity, (tax) => tax.products, { cascade: ['insert', 'update'], })
  @Field(() => TaxEntity)
  @JoinColumn({ name: 'taxId' })
  tax: TaxEntity;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int)
  taxId: number;

  @OneToMany((type) => ProductOptionEntity, (m) => m.product, { cascade: ['insert', 'update'], })
  @Field(() => [ProductOptionEntity])
  productOptions: ProductOptionEntity[];

  @ManyToMany((type) => ModifierEntity, (modifier) => modifier.products)
  @JoinTable()
  @Field(() => [ModifierEntity])
  modifiers: ModifierEntity[];

  @ManyToOne((type) => ProductCategoryEntity, (category) => category.services)
  @Field(() => ProductCategoryEntity)
  category: ProductCategoryEntity;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  categoryId: number;

  @ManyToMany(() => StaffEntity, (staff) => staff.services)
  @Field(() => [StaffEntity])
  staffs: StaffEntity[];

  @ManyToMany((type) => PackageCategoryEntity)
  @Field(() => [PackageCategoryEntity])
  packageCategory: PackageCategoryEntity[];

  @Field(() => [AppointmentInfoEntity])
  @OneToMany(() => AppointmentInfoEntity, info => info.service)
  bookingInfo: AppointmentInfoEntity[];

  @ManyToOne(() => BillingDetailEntity, billDetail => billDetail.products)
  billDetail: BillingDetailEntity;

}
