import { Module } from '@nestjs/common';
import { SettingModule } from './setting/setting.module';
import { StaffModule } from './staff/staff.module';
import { ServiceModule } from './service/service.module';
import { BookingModule } from './booking/booking.module';
import { ReportModule } from './report/report.module';
import { LabelModule } from './label/label.module';

@Module({
  imports: [
    SettingModule,
    StaffModule,
    ServiceModule,
    BookingModule,
    ReportModule,
    LabelModule,
  ]
})
export class AppointmentModule { }
