import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ActivityService } from './activity.service';
import { GetActivity } from './dto/get-activity.dto';

@Controller('appointment/appointment-activity')
@ApiTags('appointment/appointment-activity')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class ActivityController {
    constructor(private readonly activityService: ActivityService) { }

    @Get()
    async getActivity(@Query('page') { page }: GetActivity, @User('storeId') storeId: number) {
        return this.activityService.getActivity(page, storeId);
    }

    @Get('/unread')
    async unread(@User('storeId') storeId: number) {
        return this.activityService.unread(storeId);
    }

    @Get('/readall')
    async readall(@User('storeId') storeId: number) {
        return this.activityService.readall(storeId);
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        return this.activityService.delete(id);
    }
}
