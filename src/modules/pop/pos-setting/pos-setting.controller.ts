import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PosSettingEntity } from 'src/entities/PosSetting.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { PosSettingService } from './pos-setting.service';

@Controller('pop/setting')
@ApiTags('pop/setting')
export class PosSettingController {
    constructor(private posSettingService: PosSettingService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getAllModifierOptionByStoreId(@User('storeId') storeId: number) {
        return this.posSettingService.getStorePosSettings(storeId);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async updateSetting(@Body() body: PosSettingEntity) {
        return this.posSettingService.updateSetting(body);
    }
}
