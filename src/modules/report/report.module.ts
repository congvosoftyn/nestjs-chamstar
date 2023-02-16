import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { RewardClaimedEntity } from 'src/entities/RewardClaimed.entity';
import { ReportController } from './report.controller';
import { ReportResolver } from './report.resolver';
import { ReportService } from './report.service';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInEntity, RewardClaimedEntity]),],
  controllers: [ReportController],
  providers: [ReportService, ReportResolver]
})
export class ReportModule { }
