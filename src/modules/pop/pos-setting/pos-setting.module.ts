import { Module } from '@nestjs/common';
import { PosSettingService } from './pos-setting.service';
import { PosSettingController } from './pos-setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosSettingEntity } from 'src/entities/PosSetting.entity';
import { PosSettingResolver } from './pos-setting.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PosSettingEntity])],
  providers: [PosSettingService, PosSettingResolver],
  controllers: [PosSettingController]
})
export class PosSettingModule {}