import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn, CreateDateColumn, } from 'typeorm';
import { AssignEntity } from './Assign.entity';
import { CustomerEntity } from './Customer.entity';
import { WaitListEntity } from './WaitList.entity';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Assignment')
@InputType('AssignmentInput')
@Entity('assignment')
export class AssignmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne((type) => AssignEntity, (assign) => assign.assignments, { onDelete: 'CASCADE', })
  @JoinColumn({ name: 'assignId' })
  @Field(() => AssignEntity)
  assign: AssignEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  assignId: number;

  @ManyToOne((type) => WaitListEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'waitlistId' })
  @Field(() => WaitListEntity)
  waitlist: WaitListEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  waitlistId: number;

  @ManyToOne((type) => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  @Field(() => CustomerEntity)
  customer: CustomerEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  customerId: number;

  @CreateDateColumn({ precision: null, type: 'timestamp' })
  @Field(() => Date)
  timeIn: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  timeOut: Date;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;
}
