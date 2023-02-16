import { Module, } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/entities/Company.entity';
import { ReviewEntity } from 'src/entities/Review.entity';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { MessageSentEntity } from 'src/entities/MessageSent.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { UserEntity } from 'src/entities/User.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { ReviewResolver } from './review.resolver';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([CompanyEntity, ReviewEntity, CheckInEntity, MessageSentEntity, StoreEntity, UserEntity, CustomerEntity,]),
  ],
  providers: [ReviewService, ReviewResolver],
  controllers: [ReviewController],
})
export class ReviewModule { }