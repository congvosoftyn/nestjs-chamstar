import { Module } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { WaitlistController } from './waitlist.controller';
import { WaitlistGateway } from './waitlist.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { WaitListEntity } from 'src/entities/WaitList.entity';
import { WaitlistResolver } from './waitlist.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, OpenHourEntity, StoreEntity, StoreSettingEntity, WaitListEntity])
  ],
  providers: [WaitlistService, WaitlistGateway, WaitlistResolver],
  controllers: [WaitlistController]
})
export class WaitlistModule {}
