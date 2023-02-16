import { Injectable } from '@nestjs/common';
import { CommentLikeEntity } from 'src/entities/CommentLike.entity';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';
import { CustomerPostEntity } from 'src/entities/CustomerPost.entity';
import { CustomerPostMediaEntity } from 'src/entities/CustomerPostMedia.entity';
import { PostCommentEntity } from 'src/entities/PostComment.entity';
import { PostLikeEntity } from 'src/entities/PostLike.entity';
import { NewPostDto } from './dto/NewPost.dto';

@Injectable()
export class CustomerPostService {

  async newPost(body: NewPostDto, customerId: number) {
    const { description, medias, type } = body;
    const newPost = new CustomerPostEntity();
    newPost.medias = [];
    newPost.type = type;
    newPost.customerId = customerId;
    newPost.description = description;
    if (type === 'images') {
      for (const element of medias) {
        const newMedia = new CustomerPostMediaEntity();
        newMedia.url = element
        newPost.medias.push(newMedia);
      }
    } else if (type === 'youtube') {
      for (const element of medias) {
        const newMedia = new CustomerPostMediaEntity();
        newMedia.url = element;
        newPost.medias.push(newMedia);
      }
    }
    const savePost = await newPost.save();
    const post = await this.getPostInfo(savePost.id);
    return post;
  }

  async getPosts(take: number, skip: number, fromCustomerId: number, customerId: number,) {
    const _take = +take || 10;
    const _skip = +skip || 0;
    const _customerId = fromCustomerId ? fromCustomerId : customerId;
    return await CustomerPostEntity.createQueryBuilder('p')
      .addSelect(['c.id', 'c.lastName', 'c.firstName', 'c.avatar', 't.firstName', 't.lastName', 't.id', 't.avatar',])
      .addSelect(
        `exists (${PostLikeEntity.createQueryBuilder('like')
          .select(['like.postId', 'like.customerId'])
          .where('like.postId = p.id')
          .andWhere('like.customerId = p.customerId')
          .getQuery()})`,
        'p_isLike',
      )
      .leftJoin('p.customer', 'c')
      .leftJoinAndSelect('p.medias', 'm')
      .leftJoin('p.postCustomerTag', 't')
      .take(_take)
      .skip(_skip)
      .where('p.customerId = :customerId', { customerId: _customerId })
      .orderBy('p.created', 'DESC')
      .getMany();
  }

  async likePost(postId: number, isLike = true, customerId: number) {
    if (isLike) {
      await CustomerPostEntity.createQueryBuilder().update().set({ likes: () => 'likes + 1' }).where('id = :postId', { postId }).execute();
      const newLike = new PostLikeEntity();
      newLike.postId = postId;
      newLike.customerId = customerId;
      return await newLike.save();
    } else {
      return this.removePostLike(postId, customerId);
    }
  }

  async viewPost(postId: number) {
    return await CustomerPostEntity.createQueryBuilder().update().set({ views: () => 'views + 1' }).where('id = :postId', { postId }).execute();
  }

  async getPostInfo(postId: number) {
    return await CustomerPostEntity.findOneBy({ id: postId });
  }

  async newPostComment(postId: number, comment: string, customerId: number) {
    const newComment = new PostCommentEntity();
    newComment.postId = postId;
    newComment.customerId = customerId;
    newComment.comment = comment;
    return await newComment.save();
  }

  async getPostComment(commentId: number, customerId: number) {
    return await PostCommentEntity.createQueryBuilder('c')
      .addSelect(['customer.id', 'customer.firstName', 'customer.lastName', 'customer.avatar',])
      .addSelect(
        `exists (${CommentLikeEntity.createQueryBuilder('like')
          .select(['like.commentId', 'like.customerId'])
          .where('like.commentId = c.id')
          .andWhere('like.customerId = ' + customerId)
          .getQuery()})`,
        'c_isLike',
      )
      .leftJoin('c.customer', 'customer')
      .leftJoinAndSelect('c.children', 'children')
      .orderBy('c.created', 'ASC')
      .where('c.id = :commentId', { commentId })
      .getOne();
  }

  async getPostComments(postId: number, take: number, skip: number, customerId: number,) {
    return await PostCommentEntity.createQueryBuilder('c')
      .addSelect(['customer.id', 'customer.firstName', 'customer.lastName', 'customer.avatar',])
      .addSelect(
        `exists (${CommentLikeEntity.createQueryBuilder('like')
          .select(['like.commentId', 'like.customerId'])
          .where('like.commentId = c.id')
          .andWhere('like.customerId = ' + customerId)
          .getQuery()})`,
        'c_isLike',
      )
      .leftJoin('c.customer', 'customer')
      .leftJoinAndSelect('c.children', 'children')
      .take(take || 10)
      .skip(skip || 0)
      .orderBy('c.created', 'ASC')
      .where('c.postId = :postId', { postId })
      .getMany();
  }

  async removePostLike(postId: number, customerId: number) {
    await CustomerPostEntity.createQueryBuilder().update().set({ likes: () => 'likes - 1' }).where('id = :postId', { postId }).execute();
    return await PostLikeEntity.createQueryBuilder('l').delete().where('postId = :postId AND customerId = :customerId', { postId, customerId, }).execute();
  }

  async commentLike(commnentId: number, customerId: number, isLike = true) {
    if (isLike) {
      await PostCommentEntity.createQueryBuilder().update().set({ likes: () => 'likes + 1' }).where('id = :commnentId', { commnentId }).execute();
      const newLike = new CommentLikeEntity();
      newLike.commentId = commnentId;
      newLike.customerId = customerId;
      return await newLike.save();
    } else {
      return await this.removeCommentLike(commnentId, customerId);
    }
  }

  async removeCommentLike(commnentId: number, customerId: number) {
    await PostCommentEntity.createQueryBuilder()
      .update()
      .set({ likes: () => 'likes - 1' })
      .where('id = :commnentId', { commnentId })
      .execute();
    return await CommentLikeEntity.createQueryBuilder('l')
      .delete()
      .where('commentId = :commnentId AND customerId = :customerId', {
        commnentId,
        customerId,
      })
      .execute();
  }

  async commentOnComment(postId: number, commentId: number, comment: string, customerId: number,) {
    const newComment = new PostCommentEntity();
    newComment.postId = postId;
    newComment.parentId = commentId;
    newComment.comment = comment;
    newComment.customerId = customerId;
    return await newComment.save();
  }

  async getNewsFeed(customerId: number, take: number, skip: number) {
    return await CustomerPostEntity.createQueryBuilder('cp')
      .addSelect(['cu.id', 'cu.firstName', 'cu.lastName', 'cu.avatar', 'tag.avatar', 'tag.id', 'tag.firstName', 'tag.lastName',])
      .addSelect(
        `exists (${PostLikeEntity.createQueryBuilder('like')
          .select(['like.postId', 'like.customerId'])
          .where('like.postId = cp.id')
          .andWhere('like.customerId = ' + customerId)
          .getQuery()})`,
        'cp_isLike',
      )
      .addSelect(
        `exists (${CustomerFollowingEntity.createQueryBuilder('fff')
          .select('fff.id')
          .where('fff.followingId=cu.id AND fff.customerId = ' + customerId)
          .getQuery()})`,
        'cp_isFollowing',
      )
      .leftJoin('cp.customer', 'cu')
      .leftJoinAndSelect('cp.medias', 'media')
      .leftJoin('cp.postCustomerTag', 'tag')
      .orderBy('cp.created', 'DESC')
      .take(take)
      .skip(skip)
      .where(
        `cp.customerId IN (${CustomerFollowingEntity.createQueryBuilder(
          'following',
        )
          .select('followingId')
          .where('following.customerId = ' + customerId)
          .getQuery()})`,
      )
      .orWhere('cp.customerId = :customerId', { customerId })
      .getMany();
  }

  async getReview(customerId: number) { }
}
