import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get("getMenu")
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getMenuData(@User('companyId') companyId: number) {
        return this.adminService.getMenuData(companyId);
    }

    @Get("getRate")
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getReviewRate(@User('storeId') storeId: number) {
        return this.adminService.getReviewRate(storeId);
    }

}
