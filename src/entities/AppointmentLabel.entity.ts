import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { StoreEntity } from './Store.entity';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { BillingEntity } from './Billing.entity';

@ObjectType('AppointmentLabel')
@InputType('AppointmentLabelInput')
@Entity('appointment_label')
export class AppointmentLabelEntity extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ defaultValue: '#EEEEEE' })
  @Column({ default: '#EEEEEE' })
  color: string;

  @Field()
  @Column()
  name: string;

  @Field(() => StoreEntity)
  @ManyToOne((type) => StoreEntity)
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;

  @Field(() => Int)
  @Column({ type: 'int' })
  storeId: number;

  @Field({ defaultValue: true })
  @Column({ default: true })
  isActive: boolean;

  @Field({ defaultValue: "" })
  @Column({ default: "" })
  description: string;

  @Field({ defaultValue: true })
  @Column({ default: true })
  isEditable: boolean;

  @Field()
  @CreateDateColumn({ precision: null, type: 'timestamp' })
  created: Date;

  @Field(() => BillingEntity)
  @ManyToOne((type) => BillingEntity)
  @JoinColumn({ name: 'billingId' })
  billing: BillingEntity;

  @Field(() => Int)
  @Column({ type: 'int',nullable: true })
  billingId: number;
}
