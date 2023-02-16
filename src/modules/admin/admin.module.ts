import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/entities/Review.entity';
import { AdminController } from './admin.controller';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]),],
  controllers: [AdminController],
  providers: [AdminService, AdminResolver]
})
export class AdminModule { }