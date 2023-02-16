import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingGateway } from './booking.gateway';
import { EmailModule } from 'src/modules/email/email.module';
import { BookingResolver } from './booking.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentInfoEntity } from 'src/entities/AppointmentInfo.entity';
import { NotifyModule } from 'src/modules/notify/notify.module';

@Module({
  imports: [
    EmailModule,
    NotifyModule,
    TypeOrmModule.forFeature([AppointmentInfoEntity])
  ],
  providers: [BookingService, BookingGateway, BookingResolver],
  controllers: [BookingController],
  exports: [BookingService]
})

export class BookingModule { }