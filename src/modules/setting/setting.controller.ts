import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { StoreSettingDto } from './dto/StoreSetting.dto';
import { SettingService } from './setting.service';

@Controller('setting')
@ApiTags('setting')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class SettingController {
    constructor(private settingService: SettingService) { }

    @Get()
    async getSetting(@User('storeId') storeId: number) {
        return this.settingService.getSetting(storeId);
    }

    @Put()
    async updateSetting(@Body() body: StoreSettingDto) {
        return this.settingService.updateSetting(body);
    }
}
