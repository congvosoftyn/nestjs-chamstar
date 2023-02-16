import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, BaseEntity, Unique, ManyToOne, ManyToMany, JoinTable, RelationId } from 'typeorm';
import { CompanyEntity } from './Company.entity';
import crypto = require('crypto');
import { PermissionEntity } from "./Permission.entity";
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Length, IsEmail } from 'class-validator';

@ObjectType('User')
@InputType('UserInput')
@Entity('user')
@Unique(['email'])
export class UserEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  fullName: string;

  @Column()
  @IsEmail()
  @Field(() => String)
  email: string;

  @Column({ select: false })
  @Field(() => String)
  @Length(4, 1000)
  password: string;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  isCreator: boolean;

  @ManyToMany(type => PermissionEntity, { eager: true })
  @JoinTable()
  @Field(() => [PermissionEntity])
  permissions: PermissionEntity[];

  @RelationId((user: UserEntity) => user.permissions)
  @Field(() => [Int])
  permissionIds: number[];

  @Column({ nullable: true, select: false })
  @Field(() => String, { nullable: true })
  tempPassword: string;

  @Column({ nullable: true, select: false })
  @Field(() => Date, { nullable: true })
  tempPasswordExpire: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  emailVerifyCode: string;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  emailVerified: boolean;

  @ManyToOne(type => CompanyEntity, company => company.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  @Field(() => CompanyEntity)
  company: CompanyEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  companyId: number;

  hashPassword() {
    const salt = crypto.randomBytes(32).toString('hex');
    const password_hash = crypto.createHash('sha256').update(salt + this.password).digest('hex');
    this.password = salt + password_hash;
    return this.password;
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    const salt = this.password.substring(0, 64);
    const hash = this.password.substring(64);
    const password_hash = crypto.createHash('sha256').update(salt + unencryptedPassword).digest('hex');
    return hash === password_hash;
  }

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  googleId: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  appleId: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  image: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  topicNoti: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  address: string;


  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  zipcodeRequest: string;
}
