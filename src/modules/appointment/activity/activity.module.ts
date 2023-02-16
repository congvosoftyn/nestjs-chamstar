import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentActivityEntity } from 'src/entities/AppointmentActivity.entity';
import { ActiveResolver } from './active.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentActivityEntity])],
  providers: [ActivityService, ActiveResolver],
  controllers: [ActivityController]
})

export class ActivityModule { }
