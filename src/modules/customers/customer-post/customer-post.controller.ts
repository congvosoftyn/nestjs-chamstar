import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CustomerPostService } from './customer-post.service';
import { LikePostDto } from './dto/LikePost.dto';
import { NewPostDto } from './dto/NewPost.dto';
import { QueryPostsDto } from './dto/QueryPosts.dto';

@Controller('customer-post')
@ApiTags('customer-post')
@ApiBearerAuth('customer-token')
@UseGuards(JwtCustomerAuthGuard)
export class CustomerPostController {
    constructor(private readonly customerPostService: CustomerPostService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async newPost(@Body() body: NewPostDto, @User('companyId') companyId: number) {
        return this.customerPostService.newPost(body, companyId);
    }

    @Post('/like')
    @UsePipes(new ValidationPipe())
    async likePost(@Body() { isLike, postId }: LikePostDto, @User('companyId') companyId: number) {
        return this.customerPostService.likePost(postId, isLike, companyId);
    }

    @Post('/view')
    async viewPost(@Body('postId') postId: number) {
        return this.customerPostService.viewPost(postId);
    }

    @Get('/calendar-slots')
    @UsePipes(new ValidationPipe())
    async getPosts(@Query() { skip, take, fromCustomerId }: QueryPostsDto, @User('customerId') customerId: number) {
        return this.customerPostService.getPosts(take, skip, fromCustomerId, customerId)
    }
}
