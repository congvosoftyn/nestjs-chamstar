import { Module } from '@nestjs/common';
import { PhoneVerifyService } from './phone-verify.service';
import { PhoneVerifyController } from './phone-verify.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { PhoneVerifyResolver } from './phone-verify.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [PhoneVerifyService, PhoneVerifyResolver],
  controllers: [PhoneVerifyController],
})

export class PhoneVerifyModule {}
