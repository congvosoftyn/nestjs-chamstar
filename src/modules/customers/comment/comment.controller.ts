import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CommentService } from './comment.service';
import { LikeCommentDto } from './dto/LikeComment.dto';
import { NewCommentDto } from './dto/NewComment.dto';
import { QueryCommentsDto } from './dto/QueryComments.dto';

@Controller('post-comment')
@ApiTags('post-comment')
@ApiBearerAuth('customer-token')
@UseGuards(JwtCustomerAuthGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async newComment(@Body() body: NewCommentDto, @User('customerId') customerId: number) {
        return this.commentService.newComment(body, customerId);
    }

    @Post('/like')
    @UsePipes(new ValidationPipe())
    async likeComment(@Body() { isLike, commentId }: LikeCommentDto, @User('customerId') customerId: number) {
        return this.commentService.likeComment(commentId, isLike, customerId);
    }

    @Get('/calendar-slots')
    @UsePipes(new ValidationPipe())
    async getComments(@Query() query: QueryCommentsDto, @User('customerId') customerId: number) {
        return this.commentService.getComments(query, customerId)
    }
}
