import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { QueryGetReportDto } from './dto/QueryGetReport.dto';
import { ReportService } from './report.service';

@Controller('pop/report')
@ApiTags('pop/report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async getReport(@Query() _queryGetReportDto: QueryGetReportDto, @User('storeId') storeId: number) {
        return this.reportService.getReport(_queryGetReportDto, storeId);
    }

    @Get('/transaction')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getTransaction(@User('storeId') storeId: number) {
        return this.reportService.getTransaction(storeId);
    }
}
