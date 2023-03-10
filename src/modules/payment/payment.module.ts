import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingEntity } from 'src/entities/Billing.entity';
import { CompanyEntity } from 'src/entities/Company.entity';
import { PaymentEntity } from 'src/entities/Payment.entity';
import { SiteSettingEntity } from 'src/entities/SiteSetting.entity';
import { StripesModule } from '../stripes/stripes.module';
import { PaymentController } from './payment.controller';
import { PaymentGateway } from './payment.gateway';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    StripesModule,
    TypeOrmModule.forFeature([BillingEntity, CompanyEntity, PaymentEntity, SiteSettingEntity])
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentGateway, PaymentResolver]
})
export class PaymentModule { }
