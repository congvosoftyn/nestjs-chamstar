import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { EmailModule } from 'src/modules/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/entities/Store.entity';
import { SaleTransactionEntity } from 'src/entities/SaleTransaction.entity';
import { ReceiptEntity } from 'src/entities/Receipt.entity';
import { ReceiptResolver } from './receipt.resolver';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([StoreEntity, SaleTransactionEntity, ReceiptEntity])
  ],
  providers: [ReceiptService, ReceiptResolver],
  controllers: [ReceiptController]
})
export class ReceiptModule {}