import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { FindSubscriptionDto } from './dto/FindSubscription.dto';
import { UpgradeSubscriptionDto } from './dto/UpgradeSubscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
@ApiTags('subscription')
export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getSubscription(@User('companyId') companyId: number) {
        return this.subscriptionService.getSubscription(companyId)
    }

    @Post('/upgrade')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async upgradeSubscription(@Body() body: UpgradeSubscriptionDto, @User('companyId') companyId: number) {
        return this.subscriptionService.upgradeSubscription(body, companyId)
    }

    @Get('/find')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async findSubscription(@Query() { pageNumber, pageSize }: FindSubscriptionDto, @User('companyId') companyId: number) {
        return this.subscriptionService.findSubscription(pageNumber, pageSize, companyId)
    }
}
