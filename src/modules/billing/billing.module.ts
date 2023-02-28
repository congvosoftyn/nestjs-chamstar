import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingEntity } from 'src/entities/Billing.entity';
import { BillResolver } from './bill.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([BillingEntity, ])],
  providers: [BillingService, BillResolver],
  controllers: [BillingController],
})

export class BillingModule {}
