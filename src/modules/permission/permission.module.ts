import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionResolver } from './permission.resolver';
import { PermissionService } from './permission.service';

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionResolver],
  exports: [PermissionService]
})
export class PermissionModule { }
