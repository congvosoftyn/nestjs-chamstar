import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { AnalyticService } from './analytic.service';

@Controller('pop/analytic')
@ApiTags('pop/analytic')
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getStoreDashboard(@User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.analyticService.getStoreDashboard(companyId, storeId);
    }
}
