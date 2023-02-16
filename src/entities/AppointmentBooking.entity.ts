import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { AppointmentLabelEntity } from './AppointmentLabel.entity';
import { StoreEntity } from './Store.entity';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { AppointmentInfoEntity } from './AppointmentInfo.entity';
import { CustomerEntity } from './Customer.entity';
import { BillingDetailEntity } from './BillingDetailt.entity';

export enum AppointmentBookingStatus {
  booked = 'booked',
  confirmed = 'confirmed',
  arrived = 'arrived',
  completed = 'completed',
  canceled = 'canceled',
}

@ObjectType('AppointmentBooking')
@InputType('AppointmentBookingInput')
@Entity('appointment_booking')
export class AppointmentBookingEntity extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => CustomerEntity || null, { nullable: true })
  @ManyToOne((type) => CustomerEntity, { cascade: ['insert', 'update'], eager: true, })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Field(() => Int || null, { nullable: true })
  @Column({ type: 'int' })
  customerId: number;

  @Field(() => [AppointmentInfoEntity] || null, { nullable: true })
  @OneToMany(() => AppointmentInfoEntity, info => info.booking)
  bookingInfo: AppointmentInfoEntity[];

  @Field(() => Date || null, { nullable: true })
  @Column({ precision: null, type: 'timestamp' })
  lastDate: Date;

  @Field(() => Date || null, { nullable: true })
  @Column({ precision: null, type: 'timestamp' })
  date: Date;

  @Field({ defaultValue: AppointmentBookingStatus.booked })
  @Column({ default: AppointmentBookingStatus.booked }) // danger, warning, ok
  status: string;

  @Field({ defaultValue: '#EEEEEE' })
  @Column({ default: '#EEEEEE' })
  color: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  note: string;

  @Field(() => StoreEntity || null, { nullable: true })
  @ManyToOne((type) => StoreEntity)
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;

  @Field(() => Int)
  @Column({ type: 'int' })
  storeId: number;

  @Field({ defaultValue: true })
  @Column({ default: true })
  isActive: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isCheckIn: boolean;

  @Field(() => AppointmentLabelEntity || null, { nullable: true })
  @ManyToOne((type) => AppointmentLabelEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'labelId' })
  label: AppointmentLabelEntity;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  labelId: number;

  @Field()
  @CreateDateColumn({ precision: null, type: 'timestamp' })
  created: Date;

  @Field({ defaultValue: false })
  @Column({ default: false })
  remiderSent: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  followUpSent: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  didNotShow: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  didNotShowSent: boolean;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  duration: number;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  extraTime: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  reason: string; // reason cancel booking

  @ManyToOne(() => BillingDetailEntity, billingDetail => billingDetail.bookings)
  @Field(() => BillingDetailEntity || null, { nullable: true })
  billingDetail: BillingDetailEntity;
}
