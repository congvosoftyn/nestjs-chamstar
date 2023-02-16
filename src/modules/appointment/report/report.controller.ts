import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { QueryReportDto } from './dto/QueryReport';
import { ReportService } from './report.service';

@Controller('appointment/appointment-report')
@ApiTags('appointment/appointment-report')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Get()
    async getReport(@Query() _query: QueryReportDto, @User('storeId') storeId: number) {
        return this.reportService.getReport(_query, storeId);
    }

    @Get('/12month')
    async get12MonthReports(@Query('staffId') staffId: number, @User('storeId') storeId: number) {
        return this.reportService.get12MonthReports(staffId, storeId);
    }
}
