import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/Category.entity';
import { ProductEntity } from 'src/entities/Product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
  providers: [CategoryService, ],
  controllers: [CategoryController],
})

export class CategoryModule {}
