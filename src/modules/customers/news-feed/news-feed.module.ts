import { Module } from '@nestjs/common';
import { NewsFeedService } from './news-feed.service';
import { NewsFeedController } from './news-feed.controller';
import { CustomerPostModule } from '../customer-post/customer-post.module';

@Module({
  imports: [CustomerPostModule],
  providers: [NewsFeedService],
  controllers: [NewsFeedController]
})
export class NewsFeedModule { }