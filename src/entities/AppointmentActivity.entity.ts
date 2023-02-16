import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { AppointmentBookingEntity } from './AppointmentBooking.entity';
import { StoreEntity } from './Store.entity';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

export enum AppointmentActivityEventType {
  new = 'new',
  reschedule = ' reschedule',
  cancel = 'cancel',
  arrival = 'arrival',
  started = 'started',
  noshow = 'noshow',
}

@ObjectType('AppointmentActivity')
@InputType('AppointmentActivityInput')
@Entity('appointment_activity')
export class AppointmentActivityEntity extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ defaultValue: AppointmentActivityEventType.new })
  @Column({ default: AppointmentActivityEventType.new }) // new, reschedule, cancel, arrival, started, noshow,
  eventType: string;

  @Field(() => StoreEntity)
  @ManyToOne((type) => StoreEntity)
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;

  @Field(() => Int)
  @Column({ type: 'int' })
  storeId: number;

  @Field(() => AppointmentBookingEntity)
  @ManyToOne((type) => AppointmentBookingEntity)
  @JoinColumn({ name: 'bookingId' })
  booking: AppointmentBookingEntity;

  @Field(() => Int)
  @Column({ type: 'int' })
  bookingId: number;

  @Field()
  @CreateDateColumn({ precision: null, type: 'timestamp' })
  created: Date;

  @Field(() => Boolean, { defaultValue: false })
  @Column({ default: false })
  read: boolean;
}
