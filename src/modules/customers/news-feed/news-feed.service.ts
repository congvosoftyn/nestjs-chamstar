import { Injectable } from '@nestjs/common';
import { CustomerPostService } from '../customer-post/customer-post.service';
import { QueryLoadFeedDto } from './dto/QueryLoadFeed.dto';

@Injectable()
export class NewsFeedService {
  constructor(private readonly customerPostService: CustomerPostService) {}

  async loadFeed(query: QueryLoadFeedDto, customerId: number) {
    const take = +query.take || 10;
    const skip = +query.skip || 0;
    return await this.customerPostService.getNewsFeed(customerId, take, skip);
  }
}
