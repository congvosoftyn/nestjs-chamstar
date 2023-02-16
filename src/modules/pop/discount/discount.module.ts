import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { DiscountEntity } from 'src/entities/Discount.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountResolver } from './discount.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity])],
  providers: [DiscountService, DiscountResolver],
  controllers: [DiscountController]
})
export class DiscountModule {}
