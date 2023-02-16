import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { CronJobController } from './cron-job.controller';
import { EmailModule } from '../email/email.module';
import { StripesModule } from '../stripes/stripes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { BillingEntity } from 'src/entities/Billing.entity';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { CompanyEntity } from 'src/entities/Company.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerGroupEntity } from 'src/entities/CustomerGroup.entity';
import { PackageEntity } from 'src/entities/Package.entity';
import { PromotionEntity } from 'src/entities/Promotion.entity';
import { SiteSettingEntity } from 'src/entities/SiteSetting.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { SubscriptionEntity } from 'src/entities/Subscription.entity';
import { UserEntity } from 'src/entities/User.entity';

@Module({
  imports: [
    EmailModule,
    StripesModule,
    TypeOrmModule.forFeature([
      AppointmentBookingEntity,
      BillingEntity,
      CheckInEntity,
      CompanyEntity,
      CompanyCustomerEntity,
      CustomerEntity,
      CustomerGroupEntity,
      PackageEntity,
      PromotionEntity,
      SiteSettingEntity,
      StoreSettingEntity,
      SubscriptionEntity,
      UserEntity
    ]),
  ],
  providers: [CronJobService],
  controllers: [CronJobController],
  exports: [CronJobService],
})
export class CronJobModule { }
