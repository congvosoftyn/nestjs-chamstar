import { forwardRef, Module } from '@nestjs/common';
import { CustomersModule } from '../customers.module';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';
import { FollowResolver } from './follow.resolver';

@Module({
  imports: [
    forwardRef(() => CustomersModule),
    TypeOrmModule.forFeature([CustomerFollowingEntity])
  ],
  providers: [FollowService,FollowResolver],
  controllers: [FollowController]
})
export class FollowModule {}

