import { Module, } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { BillingDetailEntity } from 'src/entities/BillingDetailt.entity';
import { BookingModule } from '../appointment/booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckInEntity, CustomerEntity, BillingDetailEntity]),
    BookingModule
  ],
  controllers: [CheckinController],
  providers: [CheckinService, ],
})

export class CheckinModule { }
