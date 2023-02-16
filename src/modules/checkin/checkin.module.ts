import { Module, } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinController } from './checkin.controller';
import { CheckinGateway } from './checkin.gateway';
import { CheckinService } from './checkin.service';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CheckInResolver } from './checkin.resolver';
import { BillingDetailEntity } from 'src/entities/BillingDetailt.entity';
import { BookingModule } from '../appointment/booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckInEntity, CompanyCustomerEntity, CustomerEntity, BillingDetailEntity]),
    BookingModule
  ],
  controllers: [CheckinController],
  providers: [CheckinService, CheckinGateway, CheckInResolver],
})

export class CheckinModule { }
