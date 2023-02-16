import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { SaleTransactionEntity } from 'src/entities/SaleTransaction.entity';
import { AnalyticController } from './analytic.controller';
import { AnalyticResolver } from './analytic.resolver';
import { AnalyticService } from './analytic.service';

@Module({
    imports: [TypeOrmModule.forFeature([CheckInEntity, CustomerEntity, SaleTransactionEntity])],
    providers: [AnalyticService,AnalyticResolver],
    controllers: [AnalyticController]
})
export class AnalyticModule {}
