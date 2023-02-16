import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SaleProductEntity } from "./SaleProduct.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('SaleGiftCard')
@InputType('SaleGiftCardInput')
@Entity('sale_gift_card')
export class SaleGiftCardEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column("decimal", { precision: 11, scale: 2, default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    loadedBalance: number;

    @Column({ type: 'bigint' })
    @Field(() => Int)
    code: number

    @OneToOne(type => SaleProductEntity, saleProduct => saleProduct.saleGiftCard)
    @Field(() => SaleProductEntity)
    saleProduct: SaleProductEntity;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    recipientName?: string

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    recipientEmail?: string

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    senderEmail?: string

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    senderName?: string
}
