import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { StoreEntity } from './Store.entity';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType('AppointmentSetting')
@InputType('AppointmentSettingInput')
@Entity('appointment_setting')
export class AppointmentSettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  //Booking policies
  @Column({ default: 15 }) // in minutes
  @Field(() => Int, { defaultValue: 15 })
  bookingSlotSize: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  noteForCustomer: string;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  cancellationPolicy: number; // 0 for anythime, unit in hour

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  offHoursBooking: boolean; //allow customer book off hour

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  doubleBooking: boolean; //allow customer book off hour

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  customServiceDuration: boolean;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  customServiceCost: boolean;

  @Column({ default: 15 })
  @Field(() => Int, { defaultValue: 15 })
  appointmentSlots: number; // slot in calendar, unit in minute

  @Column({ default: 1 })
  @Field(() => Int, { defaultValue: 1 })
  weekStartDay: number; // 1 for Monday, this setting for calendar

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  reminder: boolean; // turn on of reminder

  @Column({ default: 'Reminder for your appointment SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME.', })
  @Field({ defaultValue: 'Reminder for your appointment SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME.', })
  bookingReminderMessage: string;

  @Column({ default: 60 })
  @Field(() => Int, { defaultValue: 60 })
  reminderInMinute: number;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: true })
  rebookingReminder: boolean;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  bookingChanges: boolean;

  @Field({ defaultValue: `Your appointment has been booked with STAFF_NAME on BOOKING_DATE_TIME for SERVICE_NAME.`, })
  @Column({ default: `Your appointment has been booked with STAFF_NAME on BOOKING_DATE_TIME for SERVICE_NAME.`, })
  bookingConfirmedMessage: string;

  @Field({ defaultValue: `Your appointment for SERVICE_NAME with STAFF_NAME has been rescheduled to BOOKING_DATE_TIME.`, })
  @Column({ default: `Your appointment for SERVICE_NAME with STAFF_NAME has been rescheduled to BOOKING_DATE_TIME.`, })
  bookingChangedMessage: string;

  @Field({ defaultValue: `Your appointment for SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME has been removed.`, })
  @Column({ default: `Your appointment for SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME has been removed.`, })
  bookingCancelledMessage: string;

  @Field(() => Int, { defaultValue: 30 })
  @Column({ default: 30 })
  rebookingReminderInDay: number;

  @Field({ defaultValue: `Hi FIRST_NAME, we have not seen you at STORE_NAME in a while! Book in a appointment today and receive 10% off. Call us or book online STORE_LINK`, })
  @Column({ default: `Hi FIRST_NAME, we have not seen you at STORE_NAME in a while! Book in a appointment today and receive 10% off. Call us or book online STORE_LINK`, })
  rebookingReminderMessage: string;

  @Field(() => Boolean, { defaultValue: false })
  @Column({ default: false })
  didNotShow: boolean;

  @Field(() => Int, { defaultValue: 60 })
  @Column({ default: 60 })
  didNotShowAfterMinute: number;

  @Field({ defaultValue: `Hello FIRST_NAME, We did not see you today at STORE_NAME. Let us know when would be the best time to reschedule your appointment. Thank you and see you soon!`, })
  @Column({ default: `Hello FIRST_NAME, We did not see you today at STORE_NAME. Let us know when would be the best time to reschedule your appointment. Thank you and see you soon!`, })
  didNotShowMessage: string;

  @Field(() => Boolean, { defaultValue: false })
  @Column({ default: false })
  folllowUp: boolean;

  @Field(() => Int, { defaultValue: 60 })
  @Column({ default: 60 })
  folllowUpAfterMinute: number;

  @Field({ defaultValue: `Hello FIRST_NAME, thanks for visit us at STORE_NAME! We hope you enjoyed your visit! If you did, we would love if you could leave us a review on Yelp!`, })
  @Column({ default: `Hello FIRST_NAME, thanks for visit us at STORE_NAME! We hope you enjoyed your visit! If you did, we would love if you could leave us a review on Yelp!`, })
  folllowUpMessage: string;

  @OneToOne((type) => StoreEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  @Field(() => GraphQLJSON)
  store: StoreEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  storeId: number;
}
