import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { RewardEntity } from 'src/entities/Reward.entity';
import { RewardClaimedEntity } from 'src/entities/RewardClaimed.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { RewardController } from './reward.controller';
import { RewardResolver } from './reward.resolver';
import { RewardService } from './reward.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyCustomerEntity, RewardEntity, RewardClaimedEntity, StoreSettingEntity])],
  controllers: [RewardController],
  providers: [RewardService, RewardResolver]
})
export class RewardModule {}