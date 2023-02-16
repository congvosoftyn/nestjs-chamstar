import { Module } from '@nestjs/common';
import { GiftCardService } from './gift-card.service';
import { GiftCardController } from './gift-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { GiftCardEntity } from 'src/entities/GiftCard.entity';
import { GiftCardResolver } from './gift-card.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyCustomerEntity, GiftCardEntity])],
  providers: [GiftCardService,GiftCardResolver],
  controllers: [GiftCardController]
})
export class GiftCardModule {}
