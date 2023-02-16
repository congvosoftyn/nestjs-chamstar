import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentLabelEntity } from 'src/entities/AppointmentLabel.entity';
import { LabelResolver } from './label.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentLabelEntity])],
  providers: [LabelService, LabelResolver],
  controllers: [LabelController]
})

export class LabelModule { }
