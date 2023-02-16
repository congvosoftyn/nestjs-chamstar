import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionEntity } from 'src/entities/Promotion.entity';
import { PromotionResolver } from './promotion.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionEntity]),],
  providers: [PromotionService, PromotionResolver],
  controllers: [PromotionController]
})
export class PromotionModule { }
