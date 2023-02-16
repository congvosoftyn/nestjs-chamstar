import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { RedisCacheModule } from './cache/redisCache.module';
import { CustomerModule } from './customer/customer.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { CheckinModule } from './checkin/checkin.module';
import { SettingModule } from './setting/setting.module';
import { RewardModule } from './reward/reward.module';
import { StoreModule } from './store/store.module';
import { PromotionModule } from './promotion/promotion.module';
import { ReportModule } from './report/report.module';
import { GroupModule } from './group/group.module';
import { BillingModule } from './billing/billing.module';
import { AddonModule } from './addon/addon.module';
import { PaymentModule } from './payment/payment.module';
import { StripesModule } from './stripes/stripes.module';
import { ReviewModule } from './review/review.module';
import { UrlshortenModule } from './urlshorten/urlshorten.module';
import { PackageModule } from './package/package.module';
import { PhoneVerifyModule } from './phone-verify/phoneVerify.module';
import { PermissionModule } from './permission/permission.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AssignmentModule } from './assignment/assignment.module';
import { EmployeeModule } from './employee/employee.module';
import { RoleModule } from './role/role.module';
import { PopModule } from './pop/pop.module';
import { AppointmentModule } from './appointment/appointment.module';
import { CustomersModule } from './customers/customers.module';
import { CronJobModule } from './cron-job/cron-job.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { PackageCategoryModule } from './package-category/package-category.module';


@Module({
    imports: [
        UserModule,
        EmailModule,
        RedisCacheModule,
        CustomerModule,
        UploadModule,
        AdminModule,
        CheckinModule,
        SettingModule,
        RewardModule,
        StoreModule,
        PromotionModule,
        ReportModule,
        GroupModule,
        BillingModule,
        AddonModule,
        PaymentModule,
        StripesModule,
        ReviewModule,
        UrlshortenModule,
        PackageModule,
        PhoneVerifyModule,
        PermissionModule,
        WaitlistModule,
        SubscriptionModule,
        AssignmentModule,
        EmployeeModule,
        RoleModule,
        PopModule,
        AppointmentModule,
        CustomersModule,
        CronJobModule,
        ChatModule,
        MessageModule,
        PackageCategoryModule
    ],
})
export class ModulesModule { }
