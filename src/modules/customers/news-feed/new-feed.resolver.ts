import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CustomerPostEntity } from 'src/entities/CustomerPost.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { QueryLoadFeedInput } from './dto/QueryLoadFeed.input';
import { NewsFeedService } from './news-feed.service';

@Resolver(() => CustomerPostEntity)
@UseGuards(JwtAuthenticationGuard)
export class NewFeedResolver {
  constructor(private newsFeedService: NewsFeedService) {}

  // @ApiBearerAuth('customer-token')
  @Query(() => CustomerPostEntity, { name: 'calendar_slots' })
  @UsePipes(new ValidationPipe())
  async loadFeed(
    @Args('query') query: QueryLoadFeedInput,
    @User('customerId') customerId: number,
  ) {
    return this.newsFeedService.loadFeed(query, customerId);
  }
}
