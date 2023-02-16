import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { QueryReportInput } from './dto/QueryReport.input';
import { ReportService } from './report.service';

@Resolver(() => AppointmentBookingEntity)
@UseGuards(JwtAuthenticationGuard)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) { }

  @Query(() => [AppointmentBookingEntity])
  async getReport(@Args('queryReportInput') queryReportInput: QueryReportInput, @User('storeId') storeId: number,) {
    return this.reportService.getReport(queryReportInput, storeId);
  }

  @Query(() => [AppointmentBookingEntity], { name: '_12month' })
  async get12MonthReports(@Args('staffId', { type: () => Int }) staffId: number, @User('storeId') storeId: number,) {
    return this.reportService.get12MonthReports(staffId, storeId);
  }
}
