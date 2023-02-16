import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPostEntity } from 'src/entities/CustomerPost.entity';
import { CustomerPostModule } from '../customer-post/customer-post.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
    CustomerPostModule,
    TypeOrmModule.forFeature([CustomerPostEntity])
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
