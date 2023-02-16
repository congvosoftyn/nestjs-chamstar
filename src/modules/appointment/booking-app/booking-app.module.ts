import { Module, } from '@nestjs/common';
import { BookingAppService } from './booking-app.service';
import { BookingAppController } from './booking-app.controller';
import { BookingAppGateway } from './booking-app.gateway';
import { EmailModule } from 'src/modules/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentActivityEntity } from 'src/entities/AppointmentActivity.entity';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { AppointmentSettingEntity } from 'src/entities/AppointmentSetting.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { BookingAppResolver } from './booking-app.resolver';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([
      AppointmentActivityEntity,
      AppointmentBookingEntity,
      AppointmentSettingEntity,
      CompanyCustomerEntity,
      ProductEntity,
      StoreSettingEntity,
    ]),
  ],
  providers: [BookingAppService, BookingAppGateway, BookingAppResolver],
  controllers: [BookingAppController],
})
export class BookingAppModule { }
