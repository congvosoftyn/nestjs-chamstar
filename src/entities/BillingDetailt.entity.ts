import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./Product.entity";
import { BillingEntity } from "./Billing.entity";
import { AppointmentBookingEntity } from "./AppointmentBooking.entity";

@ObjectType('BillingDetails')
@InputType('BillingDetailInput')
@Entity("billing_detail")
export class BillingDetailEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @OneToMany(() => ProductEntity, p => p.billDetail)
    @JoinColumn({ name: 'productId' })
    @Field(() => [ProductEntity])
    products: ProductEntity[];

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    productId: number;

    @ManyToOne(() => BillingEntity, billing => billing)
    @Field(() => BillingEntity)
    @JoinColumn({ name: 'billingId' })
    billing: BillingEntity;

    @Column({ type: "int" })
    @Field(() => Int)
    billingId: number;

    @OneToMany(() => AppointmentBookingEntity, booking => booking.billingDetail, { eager: true })
    @JoinColumn({ name: 'bookingId' })
    @Field(() => [AppointmentBookingEntity])
    bookings: AppointmentBookingEntity[];

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    bookingId: number;

    @Column({ type: "int", default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    quantity: number;
}