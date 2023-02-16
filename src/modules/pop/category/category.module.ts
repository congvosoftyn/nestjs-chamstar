import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryEntity } from 'src/entities/ProductCategory.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { CategoryResolver } from './category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryEntity, ProductEntity])],
  providers: [CategoryService, CategoryResolver],
  controllers: [CategoryController],
})

export class CategoryModule {}
