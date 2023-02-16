import { Injectable } from '@nestjs/common';
import { CustomerPostEntity } from 'src/entities/CustomerPost.entity';
import { CustomerPostService } from '../customer-post/customer-post.service';
import { NewCommentDto } from './dto/NewComment.dto';
import { NewCommentReplyDto } from './dto/NewCommentReply.dto';
import { QueryCommentsDto } from './dto/QueryComments.dto';

@Injectable()
export class CommentService {
  constructor(private readonly customerPostService: CustomerPostService) {}

  async getComments(query: QueryCommentsDto, customerId: number) {
    const postId = +query.postId;
    const take = +query.take;
    const skip = +query.skip;
    return await this.customerPostService.getPostComments(
      postId,
      take,
      skip,
      customerId,
    );
  }

  async newComment(body: NewCommentDto, customerId: number) {
    const { comment, postId } = body;
    const result = await this.customerPostService.newPostComment(
      postId,
      comment,
      customerId,
    );
    await CustomerPostEntity.createQueryBuilder()
      .update()
      .set({ comments: () => 'comments + 1' })
      .where('id = :postId', { postId })
      .execute();
    return await this.customerPostService.getPostComment(result.id, customerId);
  }

  async newCommentReply(body: NewCommentReplyDto, customerId: number) {
    const { comment, postId, commentId } = body;
    return await this.customerPostService.commentOnComment(
      postId,
      commentId,
      comment,
      customerId,
    );
  }

  async likeComment(commentId: number, isLike: boolean, customerId: number) {
    return await this.customerPostService.commentLike(
      commentId,
      customerId,
      isLike,
    );
  }
}
