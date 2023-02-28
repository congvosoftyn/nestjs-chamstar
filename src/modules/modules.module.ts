import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { RedisCacheModule } from './cache/redisCache.module';
import { CustomerModule } from './customer/customer.module';
import { UploadModule } from './upload/upload.module';
import { CheckinModule } from './checkin/checkin.module';
import { SettingModule } from './setting/setting.module';
import { StoreModule } from './store/store.module';
import { BillingModule } from './billing/billing.module';
import { PaymentModule } from './payment/payment.module';
import { PopModule } from './pop/pop.module';
import { AppointmentModule } from './appointment/appointment.module';
import { CustomersModule } from './customers/customers.module';
import { PackageCategoryModule } from './package-category/package-category.module';


@Module({
    imports: [
        UserModule,
        EmailModule,
        RedisCacheModule,
        CustomerModule,
        UploadModule,
        CheckinModule,
        SettingModule,
        StoreModule,
        BillingModule,
        PaymentModule,
        PopModule,
        AppointmentModule,
        CustomersModule,
        PackageCategoryModule
    ],
})
export class ModulesModule { }
