import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostCommentEntity } from 'src/entities/PostComment.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { CommentService } from './comment.service';
import { QueryCommentsInput } from './dto/QueryComments.input';

@Resolver(() => PostCommentEntity)
@UseGuards(JwtCustomerAuthGuard)
export class ComponentResolver {
  constructor(private readonly commentService: CommentService) { }

  //   @ApiBearerAuth('customer-token')
  @Mutation(() => PostCommentEntity)
  @UsePipes(new ValidationPipe())
  async newComment(@Args('comment', { type: () => String }) comment: string, @Args('postId', { type: () => Int }) postId: number, @User('customerId') customerId: number,) {
    return this.commentService.newComment({ comment, postId }, customerId);
  }

  //   @ApiBearerAuth('customer-token')
  @Mutation(() => PostCommentEntity, { name: 'like' })
  @UsePipes(new ValidationPipe())
  async likeComment(@Args('isLike', { type: () => Boolean }) isLike: boolean, @Args('commentId', { type: () => Int }) commentId: number, @User('customerId') customerId: number,) {
    return this.commentService.likeComment(commentId, isLike, customerId);
  }

  //   @ApiBearerAuth('customer-token')
  @Query(() => PostCommentEntity, { name: 'calendar_slots' })
  @UsePipes(new ValidationPipe())
  async getComments(@Args('query') query: QueryCommentsInput, @User('customerId') customerId: number,) {
    return this.commentService.getComments(query, customerId);
  }
}
