import { Module } from '@nestjs/common';
import { CustomerPostService } from './customer-post.service';
import { CustomerPostController } from './customer-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLikeEntity } from 'src/entities/CommentLike.entity';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';
import { CustomerPostEntity } from 'src/entities/CustomerPost.entity';
import { CustomerPostMediaEntity } from 'src/entities/CustomerPostMedia.entity';
import { PostCommentEntity } from 'src/entities/PostComment.entity';
import { PostLikeEntity } from 'src/entities/PostLike.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentLikeEntity, CustomerFollowingEntity, CustomerPostEntity, CustomerPostMediaEntity, PostCommentEntity, PostLikeEntity,]),
  ],
  providers: [CustomerPostService],
  controllers: [CustomerPostController],
  exports: [CustomerPostService],
})
export class CustomerPostModule { }
