import { Module } from '@nestjs/common';
import { BookingWebService } from './booking-web.service';
import { BookingWebController } from './booking-web.controller';
import { EmailModule } from 'src/modules/email/email.module';
import { BookingWebGateway } from './booking-web.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentActivityEntity } from 'src/entities/AppointmentActivity.entity';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { BookingWebResolver } from './booking-web.resolver';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([
      AppointmentActivityEntity,
      AppointmentBookingEntity,
      CompanyCustomerEntity,
      CustomerEntity,
      ProductEntity,
      StaffEntity,
      StoreEntity,
      StoreSettingEntity,
    ]),
  ],
  providers: [BookingWebService, BookingWebGateway, BookingWebResolver],
  controllers: [BookingWebController],
})
export class BookingWebModule {}
