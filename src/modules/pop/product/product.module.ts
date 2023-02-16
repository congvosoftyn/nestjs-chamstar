import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/Product.entity';
import { ProductCategoryEntity } from 'src/entities/ProductCategory.entity';
import { ProductOptionEntity } from 'src/entities/ProductOption.entity';
import { UploadModule } from 'src/modules/upload/upload.module';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [
    UploadModule,
    TypeOrmModule.forFeature([ProductEntity, ProductCategoryEntity, ProductOptionEntity])
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver]
})
export class ProductModule { }