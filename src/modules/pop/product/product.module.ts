import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/Product.entity';
import { CategoryEntity } from 'src/entities/Category.entity';
import { UploadModule } from 'src/modules/upload/upload.module';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [
    UploadModule,
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, ])
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver]
})
export class ProductModule { }