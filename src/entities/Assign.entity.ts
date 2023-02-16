import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, ManyToMany, JoinColumn, OneToMany } from "typeorm";
import { AssignmentEntity } from "./Assignment.entity";
import { SaleTransactionEntity } from "./SaleTransaction.entity";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Assign')
@InputType('AssignInput')
@Entity('assign')
export class AssignEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Field(() => Boolean, { defaultValue: true })
    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    orderBy: number;

    @OneToMany(type => AssignmentEntity, assignment => assignment.assign)
    @Field(() => [AssignmentEntity])
    assignments: AssignmentEntity[];

    @OneToMany(type => SaleTransactionEntity, sale => sale.assign)
    @Field(() => [SaleTransactionEntity])
    saleTransactions: SaleTransactionEntity[];

    // For Ploor plan position and size

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    x: number;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    y: number;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    height: number;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    width: number;

    @Column({ nullable: true })
    @Field(() => Boolean, { nullable: true })
    isRect: boolean;
}