import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, ManyToMany, JoinTable, RelationId, JoinColumn } from "typeorm";
import { PermissionEntity } from "./Permission.entity";
import { CompanyEntity } from "./Company.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType('Role')
@InputType('RoleInput')
@Entity('role')
export class RoleEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({ default: false })
    @Field({ defaultValue: false })
    isCoreRole: boolean;

    @ManyToMany(type => PermissionEntity)
    @JoinTable()
    @Field(() => [PermissionEntity])
    permissions: PermissionEntity[];

    @RelationId((role: RoleEntity) => role.permissions)
    @Field(() => [Int])
    permissionIds: number[];

    @ManyToOne(type => CompanyEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    @Field(() => CompanyEntity)
    company: CompanyEntity;

    @Column({ type: 'int' })
    @Field(() => Int)
    companyId: number;
}