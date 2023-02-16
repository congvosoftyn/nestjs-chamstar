import { Body, Controller, Get, Param, Post, Query, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { AddMoodDto } from './dto/AddMood.dto';
import { MessageStatusDto } from './dto/MessageStatus.dto';
import { UpdateReviewDto } from './dto/UpdateReview.dto';
import { ReviewService } from './review.service';

@Controller('review')
@ApiTags('review')
export class ReviewController {
    constructor(private reviewService: ReviewService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getReviews(@Query('page') page: number, @User('storeId') storeId: number) {
        return this.reviewService.getReviews(page, storeId);
    }

    @Get('/company')
    async getCompanyData(@Query('token') token: string) {
        return this.reviewService.getCompanyData(token);
    }

    @Get('/string/:id')
    async getStoreData(@Param('id') id: string) {
        return this.reviewService.getStoreData(id);
    }

    @Get('/messageStatus')
    @UsePipes(new ValidationPipe())
    async messageStatus(@Body() body: MessageStatusDto) {
        return this.reviewService.messageStatus(body);
    }

    @Post('/mood')
    @UsePipes(new ValidationPipe())
    async addMood(@Body() body: AddMoodDto) {
        return this.reviewService.addMood(body);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async updateReview(@Body() body: UpdateReviewDto) {
        return this.reviewService.updateReview(body);
    }
}
