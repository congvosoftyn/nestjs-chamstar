import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { RegisterService } from './register.service';

@Controller('pop/register')
@ApiTags('pop/register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getRegister(@Query('deviceId') deviceId: string, @User('storeId') storeId: number, @User('userId') userId: number) {
        return this.registerService.getRegister(deviceId, storeId, userId);
    }
}
