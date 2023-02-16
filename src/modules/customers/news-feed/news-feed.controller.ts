import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { QueryLoadFeedDto } from './dto/QueryLoadFeed.dto';
import { NewsFeedService } from './news-feed.service';

@Controller('customer-newsfeed')
@ApiTags('customer-newsfeed')
export class NewsFeedController {
    constructor(private newsFeedService: NewsFeedService) { }

    @Get('/calendar-slots')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    @UsePipes(new ValidationPipe())
    async loadFeed(@Query() query: QueryLoadFeedDto, @User('customerId') customerId: number) {
        return this.newsFeedService.loadFeed(query, customerId)
    }
}
