import { Module, } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from 'src/entities/Role.entity';
import { RoleResolver } from './role.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleService, RoleResolver],
  controllers: [RoleController]
})
export class RoleModule {}