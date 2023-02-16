import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { ProductEntity } from './Product.entity';
import { StaffBreakTimeEntity } from './StaffBreakTime.entity';
import { StaffTimeOffEntity } from './StaffTimeOff.entity';
import { StaffWorkingHourEntity } from './StaffWorkingHour.entity';
import { StoreEntity } from './Store.entity';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { AppointmentInfoEntity } from './AppointmentInfo.entity';

@ObjectType('Staff')
@InputType('StaffInput')
@Entity('staff')
export class StaffEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  avatar: string;

  @ManyToMany((type) => ProductEntity, (product) => product.staffs)
  @JoinTable()
  @Field(() => [ProductEntity])
  services: ProductEntity[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  directLink: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description: string;

  @OneToMany((type) => StaffWorkingHourEntity, (hour) => hour.staff, { eager: true, cascade: true, })
  @Field(() => [StaffWorkingHourEntity])
  workingHours: StaffWorkingHourEntity[];

  @OneToMany((type) => StaffBreakTimeEntity, (hour) => hour.staff, { eager: true, cascade: true, })
  @Field(() => [StaffBreakTimeEntity])
  breakTimes: StaffBreakTimeEntity[];

  @OneToMany((type) => StaffTimeOffEntity, (hour) => hour.staff, { eager: true, cascade: true, })
  @Field(() => [StaffTimeOffEntity])
  timeOffs: StaffTimeOffEntity[];

  @Column({ nullable: false })
  @Field(() => Int, { nullable: true })
  storeId: number;

  @ManyToOne((type) => StoreEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  @Field(() => StoreEntity)
  store: StoreEntity;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;

  @Field(() => [AppointmentInfoEntity] || [], { nullable: true })
  @OneToMany(() => AppointmentInfoEntity, info => info.staff)
  bookingInfos: AppointmentInfoEntity[];
}
