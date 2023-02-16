import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from 'src/entities/Subscription.entity';
import { SubscriptionResolver } from './subscription.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity])],
  providers: [SubscriptionService, SubscriptionResolver],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}