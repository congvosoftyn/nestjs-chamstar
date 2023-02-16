import { Entity, PrimaryGeneratedColumn, BaseEntity, JoinColumn, Column, ManyToOne } from "typeorm";
import { CompanyEntity } from "./Company.entity";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Promotion')
@InputType('PromotionInput')
@Entity('promotion')
export class PromotionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    text: string;

    @Column()
    @Field()
    description: string;
    // @Column({default: () => "timezone('utc', now())" })
    // @CreateDateColumn()
    @Column()
    @Field(() => Date)
    createDate: Date;

    @Column()
    @Field(() => Date)
    startDate: Date;

    @Column()
    @Field(() => Date)
    endDate: Date;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    isSend: boolean;

    @Column({ default: '0' })
    @Field(() => String, { defaultValue: '0' })
    groups: string;

    @ManyToOne(type => CompanyEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    @Field(() => CompanyEntity)
    company: CompanyEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    companyId: number;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;
}
