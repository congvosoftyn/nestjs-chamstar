import { Entity, PrimaryGeneratedColumn, BaseEntity, JoinColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { CompanyCustomerEntity } from "./CompanyCustomer.entity";
import { CompanyEntity } from "./Company.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('CustomerGroup')
@InputType('CustomerGroupInput')
@Entity('customer_group')
export class CustomerGroupEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    icon: string;

    @ManyToOne(type => CompanyEntity, company => company.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    @Field(() => CompanyEntity)
    company: CompanyEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    companyId: number;

    @ManyToMany(type => CompanyCustomerEntity, customer => customer.customerGroups)
    @JoinTable()
    @Field(() => [CompanyCustomerEntity])
    companyCustomer: CompanyCustomerEntity[];
}