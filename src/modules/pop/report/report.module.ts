import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PaymentTransactionEntity } from 'src/entities/PaymentTransaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportResolver } from './report.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransactionEntity])],
  providers: [ReportService, ReportResolver],
  controllers: [ReportController]
})
export class ReportModule {}