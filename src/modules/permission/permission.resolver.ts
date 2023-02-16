import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { PermissionEntity } from 'src/entities/Permission.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { PermissionService } from './permission.service';

@Resolver(() => PermissionEntity)
@UseGuards(JwtAuthenticationGuard)
export class PermissionResolver {
  constructor(private permissionService: PermissionService) {}

  @Query(() => PermissionEntity, { name: "allPermissions"})
  async allPermissions() {
    return this.permissionService.allPermissions();
  }
}
