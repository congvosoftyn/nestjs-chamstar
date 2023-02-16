import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { EmailModule } from 'src/modules/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftCardEntity } from 'src/entities/GiftCard.entity';
import { PaymentTransactionEntity } from 'src/entities/PaymentTransaction.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { SaleGiftCardEntity } from 'src/entities/SaleGiftCard.entity';
import { SaleTransactionEntity } from 'src/entities/SaleTransaction.entity';
import { SaleResolver } from './sale.resolver';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([GiftCardEntity, PaymentTransactionEntity, ProductEntity, SaleGiftCardEntity, SaleTransactionEntity])
  ],
  providers: [SaleService, SaleResolver],
  controllers: [SaleController]
})
export class SaleModule { }