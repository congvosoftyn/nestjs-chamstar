import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { SettingController } from './setting.controller';
import { SettingResolver } from './setting.resolver';
import { SettingService } from './setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreSettingEntity]),],
  controllers: [SettingController],
  providers: [SettingService, SettingResolver]
})
export class SettingModule { }
