import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { ReportResolver } from './report.resolver';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentBookingEntity])],
  providers: [ReportService, ReportResolver],
  controllers: [ReportController]
})

export class ReportModule {}
