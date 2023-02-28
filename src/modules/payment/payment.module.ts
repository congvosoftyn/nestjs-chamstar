import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingEntity } from 'src/entities/Billing.entity';
import { CompanyEntity } from 'src/entities/Company.entity';
import { PaymentEntity } from 'src/entities/Payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentGateway } from './payment.gateway';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillingEntity, CompanyEntity, PaymentEntity, ])
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentGateway]
})
export class PaymentModule { }
