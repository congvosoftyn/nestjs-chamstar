import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ModifierOptionEntity } from "./ModifierOption.entity";
import { ProductEntity } from "./Product.entity";
import { StoreEntity } from "./Store.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Modifier')
@InputType('ModifierInput')
@Entity({ name: 'modifier', orderBy: { orderBy: 'ASC' } })
export class ModifierEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    @Field(() => StoreEntity)
    store: StoreEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    storeId: number;

    @Column({ default: true })
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;

    @Column({ default: 0 })
    @Field(() => Int, { defaultValue: 0 })
    orderBy: number;

    @Column({ default: false })
    @Field(() => Boolean, { defaultValue: false })
    selectOneOnly: boolean;

    @OneToMany(type => ModifierOptionEntity, m => m.modifier)
    @Field(() => [ModifierOptionEntity])
    modifierOptions: ModifierOptionEntity[];

    @ManyToMany(type => ProductEntity, product => product.modifiers)
    @Field(() => [ProductEntity])
    products: ProductEntity[];


}