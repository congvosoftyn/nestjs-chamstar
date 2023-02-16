import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DiscountEntity } from "./Discount.entity";
import { ModifierOptionEntity } from "./ModifierOption.entity";
import { ProductEntity } from "./Product.entity";
import { ProductOptionEntity } from "./ProductOption.entity";
import { SaleGiftCardEntity } from "./SaleGiftCard.entity";
import { SaleTransactionEntity } from "./SaleTransaction.entity";
import { TaxEntity } from "./Tax.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import GraphQLJSON from "graphql-type-json";

@ObjectType('SaleProduct')
@InputType('SaleProductInput')
@Entity('sale_product')
export class SaleProductEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @ManyToOne(type => ProductEntity, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'productId' })
    @Field(() => ProductEntity)
    product: ProductEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    productId: number;

    @ManyToOne(type => ProductOptionEntity, { eager: true })
    @Field(() => ProductOptionEntity)
    productOption: ProductOptionEntity;

    @ManyToMany(type => ModifierOptionEntity, { eager: true })
    @JoinTable()
    @Field(() => [ModifierOptionEntity])
    modifierOptions: ModifierOptionEntity[];

    @ManyToOne(type => SaleTransactionEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'saleTransactionId' })
    @Field(() => SaleTransactionEntity)
    saleTransaction: SaleTransactionEntity;

    @Column({ type: 'int', default: 1 })
    @Field(() => Int, { defaultValue: 1 })
    saleTransactionId: number;

    @ManyToMany(type => TaxEntity)
    @JoinTable()
    @Field(() => [TaxEntity])
    taxes: TaxEntity[];

    @ManyToMany(type => DiscountEntity, { eager: true })
    @JoinTable()
    @Field(() => [DiscountEntity])
    discounts: DiscountEntity[];

    @Column({ nullable: true })
    @Field()
    note: string;

    @OneToOne(type => SaleGiftCardEntity, giftcard => giftcard.saleProduct, { eager: true })
    @JoinColumn({ name: 'saleGiftCardId' })
    @Field(() => GraphQLJSON)
    saleGiftCard: SaleGiftCardEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    saleGiftCardId: number;

    public getTotal() {
        if (this.saleGiftCard) {
            return this.saleGiftCard.loadedBalance
        }
        let total = this.product.price;
        if (this.productOption) {
            total = this.productOption.price;
        }

        if (this.modifierOptions) {
            this.modifierOptions.forEach(o => total += o.price);
        }
        return total;
    }
}