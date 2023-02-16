import { Module } from '@nestjs/common';
import { ModifierOptionService } from './modifier-option.service';
import { ModifierOptionController } from './modifier-option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModifierOptionEntity } from 'src/entities/ModifierOption.entity';
import { ModifierOptionResolver } from './modifier-option.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ModifierOptionEntity])],
  providers: [ModifierOptionService, ModifierOptionResolver],
  controllers: [ModifierOptionController]
})
export class ModifierOptionModule {}