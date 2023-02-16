import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { TaxEntity } from 'src/entities/Tax.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxResolver } from './tax.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TaxEntity])],
  providers: [TaxService,TaxResolver],
  controllers: [TaxController]
})
export class TaxModule { }