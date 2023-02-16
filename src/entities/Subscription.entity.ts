import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn, BeforeUpdate, OneToMany } from "typeorm";
import { BillingEntity } from "./Billing.entity";
import { CompanyEntity } from "./Company.entity";
import { PackageEntity } from "./Package.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Subscriptions')
@InputType('SubscriptionInput')
@Entity('subscription')
export class SubscriptionEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn({ precision: null, type: "timestamp" })
  @Field(() => Date)
  created: Date;

  @UpdateDateColumn({ type: "timestamp" })
  @Field(() => Date)
  updated: Date;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;

  // @OneToMany(type => BillingEntity, subs => subs.subscription)
  // @Field(() => [BillingEntity])
  // billings: BillingEntity[];

  @ManyToOne(type => PackageEntity, p => p.subscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  @Field(() => PackageEntity)
  package: PackageEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  packageId: number;

  @ManyToOne(type => CompanyEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  @Field(() => CompanyEntity)
  company: CompanyEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  companyId: number;

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updated = new Date();
  }
}