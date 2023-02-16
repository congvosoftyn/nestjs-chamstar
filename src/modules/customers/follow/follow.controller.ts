import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserCustomer } from 'src/modules/user/decorators/user-customer.decorator';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { FollowerListDto } from './dto/FollowerList.dto';
import { FollowService } from './follow.service';

@Controller('customer-follow')
@ApiTags('customer-follow')
@ApiBearerAuth('customer-token')
@UseGuards(JwtCustomerAuthGuard)
export class FollowController {
    constructor(private readonly followService: FollowService) { }

    @Get('/follower')
    @UsePipes(new ValidationPipe())
    async followerList(@Param() _followerList: FollowerListDto) {
        return this.followService.followerList(_followerList)
    }

    @Get('/following')
    @UsePipes(new ValidationPipe())
    async followingList(@Param() _followerList: FollowerListDto) {
        return this.followService.followingList(_followerList)
    }

    @Get('/is-following')
    async isFollowing(@Query('followingId') followingId: number, @UserCustomer('customerId') customerId: number) {
        return this.followService.isFollowing(followingId, customerId)
    }

    @Post('/follow')
    async updateFollowing(@Body('followingId') followingId: number, @UserCustomer('customerId') customerId: number) {
        return this.followService.updateFollowing(followingId, customerId);
    }

    @Post('/unfollow')
    async unfollow(@Body('followingId') followingId: number, @UserCustomer('customerId') customerId: number) {
        return this.followService.updateFollowing(followingId, customerId);
    }

    @Delete('/view')
    async unfollowing(@Body('followingId') followingId: number, @UserCustomer('customerId') customerId: number) {
        return this.followService.unfollowing(followingId, customerId);
    }
}
