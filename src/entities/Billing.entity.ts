import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToMany, } from 'typeorm';
import { ObjectType, Field, Int, InputType, Float } from '@nestjs/graphql';
import { CustomerEntity } from './Customer.entity';
import { StoreEntity } from './Store.entity';
import { BillingDetailEntity } from './BillingDetailt.entity';
import { AppointmentLabelEntity } from './AppointmentLabel.entity';

@ObjectType('Billing')
@InputType('BillingInput')
@Entity('billing')
export class BillingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn({ precision: null, type: 'timestamp' })
  @Field(() => Date)
  created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  updated: Date;

  @Column()
  @Field(() => String)
  startTime: string;

  @Column()
  @Field(() => Date)
  day: Date;

  @ManyToOne((type) => StoreEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  @Field(() => StoreEntity)
  store: StoreEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  storeId: number;

  @ManyToOne((type) => CustomerEntity, (customer) => customer.billing, { onDelete: 'CASCADE', })
  @JoinColumn({ name: 'customerId' })
  @Field(() => CustomerEntity)
  customer: CustomerEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  customerId: number;

  @Column({ default: 0, type: 'float' })
  @Field(() => Int, { defaultValue: 0 })
  discount: number;

  @Column({ default: 0, type: 'float' })
  @Field(() => Int, { defaultValue: 0 })
  coupon: number;

  @Column({ nullable: true, default: '' })
  @Field(() => String, { defaultValue: '', nullable: true })
  note: string;

  @Column({ nullable: true, default: 0 })
  @Field(() => Int)
  extraTime: number;

  @Column({ default: 0, type: 'float' })
  @Field(() => Float, { defaultValue: 0 })
  total: number;

  @OneToMany(() => BillingDetailEntity, (billingDetail) => billingDetail.billing,)
  @Field(() => [BillingDetailEntity])
  billingDetails: BillingDetailEntity[];

  @OneToMany(() => AppointmentLabelEntity, (label) => label.billing, { cascade: ['insert', 'remove', 'update'], })
  @Field(() => [AppointmentLabelEntity])
  labels: AppointmentLabelEntity;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  isPaid: boolean;
}
