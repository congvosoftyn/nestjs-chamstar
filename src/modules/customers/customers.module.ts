import { Module } from '@nestjs/common';
import { CustomerPostModule } from './customer-post/customer-post.module';
import { CommentModule } from './comment/comment.module';
import { NewsFeedModule } from './news-feed/news-feed.module';
import { ClientModule } from './client/client.module';
import { FollowModule } from './follow/follow.module';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';

@Module({
    imports: [
        CustomerPostModule,
        CommentModule,
        NewsFeedModule,
        ClientModule,
        FollowModule,
        TypeOrmModule.forFeature([CustomerEntity, CustomerFollowingEntity]),
    ],
    providers: [CustomersService],
    exports: [CustomersService],
})
export class CustomersModule { }
