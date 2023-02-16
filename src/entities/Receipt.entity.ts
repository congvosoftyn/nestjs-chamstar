import { PaymentTransactionEntity } from "./PaymentTransaction.entity"
import { SaleTransactionEntity } from "./SaleTransaction.entity"
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
export const RECEIPT_BY_EMAIL = 'EMAIL'
export const RECEIPT_BY_TEXT = 'PHONE'
export class ProductShortInfo {
    name: string
    total: number
    constructor(name: string, total: number) {
        this.name = name
        this.total = total
    }
}
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Receipt')
@InputType('ReceiptInput')
@Entity('receipt')
export class ReceiptEntity extends BaseEntity {

    // @Field(() => Int)
    ammount: number
    // @Field(() => Int)
    subTotal: number
    // @Field(() => Int)
    discount?: number
    // @Field(() => Int)
    total: number
    // @Field(() => Int)
    tax: number

    // @Field(() => [ProductShortInfo])
    products: ProductShortInfo[];

    // @Field(() => [PaymentTransactionEntity])
    payments?: PaymentTransactionEntity[];

    // @Field(() => Date)
    created: Date

    // @Field()
    storeName: string

    // @Field()
    storeAddress: string

    @PrimaryColumn({ type: 'varchar' })
    @Field()
    reference: string

    @Column()
    @Field()
    methodType: string // email || phone number

    @Column()
    @Field()
    customerInfo: string // email || phone number

    @Column({ nullable: true })
    @Field({ nullable: true })
    ticketOrder: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    customerName?: string
    public buildReceiptFromSaleTransaction(saleData: SaleTransactionEntity): ReceiptEntity {
        if (!saleData) return
        this.tax = saleData.calculateTax()
        this.discount = saleData.calculateAllDiscounts()
        this.reference = saleData.reference
        this.subTotal = saleData.calculateSubTotal()
        this.total = saleData.calculateTotal()
        this.payments = saleData.payments
        this.created = saleData.created
        this.storeName = saleData.register.store.name
        this.storeAddress = saleData.register.store.fullAddress()
        this.products = saleData.products.map(product => {
            let name = ''
            let total = 0
            if (product.saleGiftCard) {
                name = 'GiftCard ' + product.saleGiftCard.code.toString().slice(-4)
                total = product.saleGiftCard.loadedBalance
            } else {
                name = product.product.name
                total += product.product.price
                if (product.productOption) {
                    total = product.productOption.price;
                }

                if (product.modifierOptions) {
                    product.modifierOptions.forEach(o => total += o.price);
                }
            }
            return new ProductShortInfo(name, total)
        })
        if (saleData.customer) {
            this.customerName = saleData.customer.getFullName()
        }
        return this
    }

}