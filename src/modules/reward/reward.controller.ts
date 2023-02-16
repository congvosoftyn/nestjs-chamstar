import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { ClaimARewardDto } from './dto/ClaimAReward.dto';
import { NewRewardDto } from './dto/NewReward.dto';
import { RewardService } from './reward.service';

@Controller('rewards')
@ApiTags('rewards')
export class RewardController {
    constructor(private rewardService: RewardService) { }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async newReward(@Body() body: NewRewardDto, @User('storeId') storeId: number) {
        return this.rewardService.newReward(storeId, body);
    }

    @Put()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async updateReward(@Body() body: NewRewardDto, @User('storeId') storeId: number) {
        return this.rewardService.newReward(storeId, body);
    }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getRewards(@Query('search') search: string, @User('storeId') storeId: number) {
        return this.rewardService.getRewards(search, storeId);
    }

    @Get('/claimed/:id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async rewardClaim(@Param('id') id: number) {
        return this.rewardService.rewardClaim(id);
    }

    @Post('/claim')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async claimAReward(@Body() body: ClaimARewardDto, @User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.rewardService.claimAReward(body, companyId, storeId);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async deleteReward(@Param('id') id: number) {
        return this.rewardService.deleteReward(id);
    }

}
