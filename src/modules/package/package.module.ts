import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageEntity } from 'src/entities/Package.entity';
import { PackageResolver } from './package.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PackageEntity])],
  providers: [PackageService, PackageResolver],
  controllers: [PackageController],
})
export class PackageModule {}
