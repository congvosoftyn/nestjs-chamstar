import { Entity, PrimaryGeneratedColumn, BaseEntity, JoinColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { CompanyCustomerEntity } from "./CompanyCustomer.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { RewardEntity } from "./Reward.entity";

@ObjectType('RewardClaimed')
@InputType('RewardClaimedInput')
@Entity('reward_claimed')
export class RewardClaimedEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @CreateDateColumn({ precision: null, type: "timestamp" })
    @Field(() => Date)
    claimDate: Date;

    @ManyToOne(type => RewardEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    @Field(() => RewardEntity)
    reward: RewardEntity;

    @ManyToOne(type => CompanyCustomerEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyCustomerId' })
    @Field(() => CompanyCustomerEntity)
    companyCustomer: CompanyCustomerEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    companyCustomerId: number;
}
