import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, CreateDateColumn, BeforeInsert, JoinColumn } from "typeorm";
import { CustomerEntity } from "./Customer.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Picture')
@InputType('PictureInput')
@Entity('picture')
export class PictureEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  thumbnail: string;

  // @ManyToOne(type => CustomerEntity, customer => customer.pictures, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'customerId' })
  // @Field(() => CustomerEntity)
  // customer: CustomerEntity;

  // @Column({ type: 'int', nullable: true })
  // @Field(() => Int, { nullable: true })
  // customerId: number;

  @CreateDateColumn({ precision: null, type: "timestamp" })
  @Field(() => Date)
  created: Date;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;

  @BeforeInsert()
  updateDateCreation() {
    this.created = new Date();
  }
}