import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { ObjectType, Field, Int, InputType, Float } from '@nestjs/graphql';
import { AppointmentBookingEntity } from './AppointmentBooking.entity';
import { ProductEntity } from './Product.entity';
import { StaffEntity } from './Staff.entity';
import { PackageCategoryEntity } from './package-category.entity';

@ObjectType('AppointmentInfo')
@InputType('AppointmentInfoInput')
@Entity('appointment_info')
export class AppointmentInfoEntity extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => AppointmentBookingEntity || null, { nullable: true })
  @ManyToOne(() => AppointmentBookingEntity, booking => booking.bookingInfo)
  @JoinColumn({ name: 'bookingId' })
  booking: AppointmentBookingEntity;

  @Field(() => Int,)
  @Column({ type: 'int' })
  bookingId: number;

  @Field(() => ProductEntity || null, { nullable: true })
  @ManyToOne(() => ProductEntity, service => service.bookingInfo)
  @JoinColumn({ name: 'serviceId' })
  service: ProductEntity;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  serviceId: number;

  @Field(() => [StaffEntity] || null, { nullable: true })
  @ManyToOne(() => StaffEntity, staff => staff.bookingInfos)
  @JoinColumn({ name: 'staffId' })
  staff: StaffEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  staffId: number;

  @Field(() => [PackageCategoryEntity] || null, { nullable: true })
  @ManyToOne(() => PackageCategoryEntity, pack => pack.bookingInfo)
  @JoinColumn({ name: 'packageId' })
  packages: PackageCategoryEntity;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  packageId: number;

  @Field(() => Float)
  @Column("float")
  price: number;

  @Column({ default: false, type: "boolean" })
  @Field({ defaultValue: false })
  deleted: boolean;

  @Field()
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}
