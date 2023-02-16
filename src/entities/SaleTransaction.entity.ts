import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AssignEntity } from "./Assign.entity";
import { CustomerEntity } from "./Customer.entity";
import { DiscountEntity } from "./Discount.entity";
import { PaymentTransactionEntity } from "./PaymentTransaction.entity";
import { RegisterEntity } from "./Register.entity";
import { RewardEntity } from "./Reward.entity";
import { SaleProductEntity } from "./SaleProduct.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('SaleTransaction')
@InputType('SaleTransactionInput')
@Entity('sale_transaction')
export class SaleTransactionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    reference: string;

    @Column({ nullable: true })
    @Field(() => String)
    note: string;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    created: Date;

    @ManyToOne(type => RegisterEntity, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'registerId' })
    @Field(() => RegisterEntity)
    register: RegisterEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    registerId: number;

    @ManyToOne(type => CustomerEntity, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'customerId' })
    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    customerId: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    tip: number;

    @ManyToMany(type => RewardEntity, { cascade: ['insert', 'update'] })
    @JoinTable()
    @Field(() => [RewardEntity])
    rewards: RewardEntity[];

    @OneToMany(type => SaleProductEntity, saleProduct => saleProduct.saleTransaction, { cascade: true, eager: true })
    @Field(() => [SaleProductEntity])
    products: SaleProductEntity[];

    @OneToMany(type => PaymentTransactionEntity, payment => payment.saleTransaction, { cascade: true, eager: true })
    @Field(() => [PaymentTransactionEntity])
    payments: PaymentTransactionEntity[];

    @ManyToOne(type => AssignEntity, assign => assign.saleTransactions, { eager: true })
    @JoinColumn({ name: 'assignId' })
    @Field(() => AssignEntity)
    assign: AssignEntity;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    assignId: number;



    // @BeforeInsert()
    // updateRefCreation() {
    //     // let result           = '';
    //     // const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    //     // const charactersLength = characters.length;
    //     // for ( var i = 0; i < 8; i++ ) {
    //     //    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     // }
    //     // this.reference = result;
    //     const unix = new Date().getTime() / 1000;
    //     this.reference = unix.toString(36);

    // }
    calculateTax() {
        let tax = 0;
        this.products.forEach(p => {
            if (!p.taxes || p.taxes.length === 0) return;
            const total = p.getTotal();
            p.taxes.forEach(t => {
                tax += t.rate * total / 100;
            });
        });
        return tax;
    }

    calculateAllDiscounts() {
        let total = 0;
        this.products.forEach(p => {
            if (p.discounts) {
                p.discounts.forEach(d => {
                    if (d.percentage) {
                        total += p.getTotal() * d.amount / 100;
                    } else {
                        total += d.amount;
                    }
                })
            }
        })
        return total;
    }
    calculateDiscount(discount: DiscountEntity) {
        let total = 0;
        this.products.forEach(p => {
            if (p.discounts && p.discounts.find(ds => ds.id === discount.id)) {
                if (discount.percentage) {
                    total += p.getTotal() * discount.amount / 100;
                } else {
                    total += discount.amount;
                }
            }
        })
        return total;
    }

    calculateTotal() {
        let total = this.calculateSubTotal()
        total -= this.calculateAllDiscounts();
        total += this.calculateTax();
        return total;
    }
    calculateSubTotal() {
        let total = 0;
        this.products.forEach(p => total += p.getTotal());
        return total
    }
    calculateRemain() {
        let payment = 0;
        let total = this.calculateTotal();
        if (!this.payments) return total;
        this.payments.forEach(p => {
            payment += p.amount;
        });

        return total - payment;
    }

}