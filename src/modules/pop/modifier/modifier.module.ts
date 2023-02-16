import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModifierEntity } from 'src/entities/Modifier.entity';
import { ModifierOptionEntity } from 'src/entities/ModifierOption.entity';
import { ModifierController } from './modifier.controller';
import { ModifierResolver } from './modifier.resolver';
import { ModifierService } from './modifier.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModifierEntity, ModifierOptionEntity])],
  controllers: [ModifierController],
  providers: [ModifierService, ModifierResolver]
})
export class ModifierModule {}