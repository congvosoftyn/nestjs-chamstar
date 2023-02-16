import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { ReportService } from './report.service';
import { QuerySaleByItemDto } from './dto/query-sale-by-item.dto';

@Controller('reports')
@ApiTags('reports')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class ReportController {
    constructor(private reportService: ReportService) { }

    @Get()
    getReports(@User('companyId') companyId: number) {
        return this.reportService.getReports(companyId);
    }

    @Get("/items")
    getSaleByItems(@Query() query: QuerySaleByItemDto, @User('storeId') storeId: number) {
        return this.reportService.salesByItems(query, storeId);
    }


}
